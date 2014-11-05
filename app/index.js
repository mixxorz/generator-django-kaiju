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
            this.bulkDirectory(path.join('kaiju', 'apps', 'core', 'templates'), path.join(this.projectName, 'apps', 'core', 'templates'));



            this.dest.mkdir(path.join(this.projectName, 'settings'));
            this.dest.write(path.join(this.projectName, 'settings', '__init__.py'), '');
        },
        projectFiles: function() {
            this.template('.bowerrc', '.bowerrc');
            this.template('README.md', 'README.md');
            this.src.copy('Gruntfile.js', 'Gruntfile.js');
            this.src.copy('.gitignore', '.gitignore');
        },
        herokuFiles: function() {
            this.template('Procfile', 'Procfile');
            this.src.copy('requirements.txt', 'requirements.txt');
            this.bulkDirectory('bin', 'bin');
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
