'use strict';
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');


var DjangoKaijuGenerator = yeoman.generators.Base.extend({
    // Override constructor
    constructor: function() {
        // Calling the super constructor is important so our generator is correctly setup
        yeoman.generators.Base.apply(this, arguments);

        this.argument('projectName', {
            desc: 'The name for your project',
            required: false,
            type: String
        });

        // Skip Install flag
        this.option('skip-install', {
            desc: 'Skip installing bower and npm dependencies.',
            type: Boolean,
            defaults: false,
            hide: false
        });

        // Don't scaffold a django app
        this.option('no-django', {
            desc: 'Don\'t create a new Django project and use the one in this folder.',
            type: Boolean,
            defaults: false,
            hide: false
        });
    },
    initializing: function() {
        this.pkg = require('../package.json');

        if (this['projectName']) {
            this.projectName = this['projectName'];
            this.skipProjectNamePrompt = true;
        } else {
            this.projectName = process.cwd().split(path.sep).pop();
            this.skipProjectNamePrompt = false;
        }
    },
    prompting: function() {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Yo Django Kaiju!'
        ));

        var done = this.async();

        var prompts = [];

        if (!this.skipProjectNamePrompt) {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: 'What\'s the name of your project?',
                default: this.projectName
            });
        }

        prompts.push({
            type: 'checkbox',
            name: 'features',
            message: 'What stuff do you want to include?',
            choices: [{
                name: 'Foundation 5',
                checked: true,
                value: 'foundation'
            }, {
                name: 'Heroku integration',
                checked: true,
                value: 'heroku'
            }]
        });

        this.prompt(prompts, function(props) {
            this.projectName = props.projectName || this.projectName;
            this.features = props.features;

            done();
        }.bind(this));
    },
    scaffoldDjangoProject: function() {
        if (!this.options['no-django']) {
            var done = this.async();
            // Use django-admin.py to scaffold new django project.
            var startproject = this.spawnCommand('django-admin startproject ' + this.projectName + ' .');
            startproject.on('close', function(code, signal) {
                done();
            });
        }
    },
    validate: function() {
        if (!this._isValidDjangoApp()) {
            this.log(chalk.red('I couldn\'t find a valid Django app \'' + this.projectName + '\'.'));
            this.log(chalk.red('Make sure you run me in the root of your Django project. (The one with your manage.py file)'));
            process.exit(1);
        }
    },
    writing: {
        djangoFiles: function() {
            var done = this.async();
            // Scaffold the core app
            this.dest.mkdir(path.join(this.projectName, 'apps'));
            this.dest.write(path.join(this.projectName, 'apps', '__init__.py'), '');
            this.dest.mkdir(path.join(this.projectName, 'apps', 'core'));
            // Copy templates
            this.template('kaiju/apps/core/templates/base.html', this.projectName + '/apps/core/templates/base.html');
            this.src.copy('kaiju/apps/core/templates/core/index.html', this.projectName + '/apps/core/templates/core/index.html');

            try {
                fs.renameSync(path.join(this.destinationRoot(), this.projectName, 'urls.py'),
                    path.join(this.destinationRoot(), this.projectName, 'urls.orig.py'));
            } catch (err) {
                this.log(chalk.yellow('Couldn\'t find urls.py'));
            }

            this.template('kaiju/urls.py', this.projectName + '/urls.py');


            // Use Django's generator to scaffold the core app
            var startapp = this.spawnCommand('python manage.py startapp core ' + path.join(this.projectName, 'apps', 'core'));
            startapp.on('close', function(code, signal) {
                done();
            });
        },
        djangoSettings: function() {
            var done = this.async();

            this.dest.mkdir(path.join(this.projectName, 'settings'));
            this.dest.write(path.join(this.projectName, 'settings', '__init__.py'), '');
            this.template('kaiju/settings/base.py', this.projectName + '/settings/base.py');
            this.template('kaiju/settings/prod.py', this.projectName + '/settings/prod.py');
            this.src.copy('kaiju/apps/core/context_processors.py', this.projectName + '/apps/core/context_processors.py');

            var generator = this;

            fs.readFile(path.join(this.destinationRoot(), this.projectName, 'settings.py'), 'utf8', function(err, data) {
                if (err) {
                    generator.log(chalk.red(err));
                }
                if (data.indexOf('SECRET_KEY') < 0) {
                    generator.log(chalk.red('I couldn\'t find SECRET_KEY in settings.py. You need to set it manually in settings/base.py'));
                } else {
                    var regexp = /SECRET_KEY = '(.*)'/g;
                    var context = {
                        projectName: generator.projectName,
                        secretKey: regexp.exec(data)[1]
                    };
                    generator.template('kaiju/settings/dev.py', generator.projectName + '/settings/dev.py', context);
                }
                done();
            });

            fs.renameSync(path.join(this.destinationRoot(), this.projectName, 'settings.py'),
                path.join(this.destinationRoot(), this.projectName, 'settings', 'settings.orig.py'));
        },
        projectFiles: function() {
            this.template('.bowerrc', '.bowerrc');
            this.src.copy('.editorconfig', '.editorconfig');
            this.src.copy('.gitignore', '.gitignore');
            // TODO: Add Font-Awesome support
            this.template('bower.json', 'bower.json');
            // This particular file requires us to change the underscore tags
            // to {{ }}
            this.template(
                'Gruntfile.js',
                'Gruntfile.js',
                this, {
                    evaluate: /\{\{([\s\S]+?)\}\}/g,
                    interpolate: /\{\{=([\s\S]+?)\}\}/g,
                    escape: /\{\{-([\s\S]+?)\}\}/g
                }
            );
            this.src.copy('package.json', 'package.json');
            this.template('README.md', 'README.md');
            this.src.copy('kaiju/apps/core/assets/.gitignore', this.projectName + '/apps/core/assets/.gitignore');
        },
        foundationFiles: function() {
            if (this.features.indexOf('foundation') !== -1) {
                this.src.copy('kaiju/apps/core/assets/app/scss/app.scss', this.projectName + '/apps/core/assets/app/scss/app.scss');
                this.src.copy('kaiju/apps/core/assets/app/scss/_settings.scss', this.projectName + '/apps/core/assets/app/scss/_settings.scss');
                this.src.copy('kaiju/apps/core/assets/app/scss/_styles.scss', this.projectName + '/apps/core/assets/app/scss/_styles.scss');
            } else {
                this.dest.write(this.projectName + '/apps/core/assets/app/scss/app.scss', '// Your sass styles go here');
            }
        },
        herokuFiles: function() {
            if (this.features.indexOf('heroku') !== -1) {
                this.template('Procfile', 'Procfile');
                this.src.copy('requirements.txt', 'requirements.txt');
                this.dest.mkdir('bin');
                this.template('bin/cleanup', 'bin/cleanup');
                this.template('bin/compile_assets', 'bin/compile_assets');
                this.src.copy('bin/install_nodejs', 'bin/install_nodejs');
                this.src.copy('bin/install_npm_packages', 'bin/install_npm_packages');
                this.src.copy('bin/post_compile', 'bin/post_compile');

                // This particular file requires us to change the underscore tags
                // to {{ }}
                this.template(
                    'bin/run_collectstatic',
                    'bin/run_collectstatic',
                    this, {
                        evaluate: /\{\{([\s\S]+?)\}\}/g,
                        interpolate: /\{\{=([\s\S]+?)\}\}/g,
                        escape: /\{\{-([\s\S]+?)\}\}/g
                    }
                );
            }
        }
        // app: function() {
        //     this.dest.mkdir('app');
        //     this.dest.mkdir('app/templates');

        //     this.src.copy('_package.json', 'package.json');
        //     this.src.copy('_bower.json', 'bower.json');
        // },

        // projectfiles: function() {
        //     this.src.copy('editorconfig', '.editorconfig');
        //     this.src.copy('jshintrc', '.jshintrc');
        // }
    },

    end: function() {
        if (!this.options['skip-install']) {
            this.installDependencies();
        }
    },
    // Helper methods
    _isValidDjangoApp: function() {
        var isValid = true;

        isValid = fs.existsSync(path.join(this.destinationRoot(), 'manage.py'));
        isValid = fs.existsSync(path.join(this.destinationRoot(), this.projectName, '__init__.py'));
        isValid = fs.existsSync(path.join(this.destinationRoot(), this.projectName, 'settings.py'));

        return isValid;
    }
});

module.exports = DjangoKaijuGenerator;
