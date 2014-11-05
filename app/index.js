'use strict';
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

        // Skip Install flag
        this.option('skip-install', {
            desc: 'Skip installing bower and npm dependencies.',
            type: Boolean,
            defaults: false,
            hide: false
        });
    },
    initializing: function() {
        this.pkg = require('../package.json');
        this.projectName = process.cwd().split(path.sep).pop();
    },
    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Yo Django Kaiju!'
        ));

        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'What\'s the name of your project?',
            default: this.projectName
        }];

        this.prompt(prompts, function(props) {
            this.projectName = props.projectName;

            done();
        }.bind(this));
    },
    validate: function() {
        if (!this._isValidDjangoApp()) {
            this.log('I couldn\'t find a valid Django app \'' + this.projectName + '\'.');
            this.log('Make sure you run me in the root of your Django project. (The one with your manage.py file)');
            process.exit(1);
        }
    },
    writing: {
        djangoFiles: function() {
            // Scaffold the core app
            this.dest.mkdir(path.join(this.projectName, 'apps'));
            this.dest.write(path.join(this.projectName, 'apps', '__init__.py'), '');
            this.dest.mkdir(path.join(this.projectName, 'apps', 'core'));
            // Use Django's generator to scaffold the core app
            this.spawnCommand('python manage.py startapp core ' + path.join(this.projectName, 'apps', 'core'));
            // Copy templates
            this.src.copy('kaiju/apps/core/templates/base.html', this.projectName + '/apps/core/templates/base.html');
            this.src.copy('kaiju/apps/core/templates/core/index.html', this.projectName + '/apps/core/templates/core/index.html');



            this.dest.mkdir(path.join(this.projectName, 'settings'));
            this.dest.write(path.join(this.projectName, 'settings', '__init__.py'), '');
        },
        projectFiles: function() {
            this.template('.bowerrc', '.bowerrc');
            this.src.copy('.gitignore', '.gitignore');
            this.src.copy('Gruntfile.js', 'Gruntfile.js');
            this.src.copy('package.json', 'package.json');
            this.template('README.md', 'README.md');
        },
        herokuFiles: function() {
            // TODO: Add prompt if the user wants Heroku integration
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
