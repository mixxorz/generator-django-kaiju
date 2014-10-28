'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');


var DjangoKaijuGenerator = yeoman.generators.Base.extend({
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
        if (!this.isValidDjangoApp()) {
            this.log('I couldn\'t find a valid Django app \'' + this.projectName + '\'.');
            this.log('Make sure you run me in the root of your Django project. (The one with your manage.py file)');
            process.exit(1);
        }
    },
    writing: {
        app: function() {
            this.dest.mkdir('app');
            this.dest.mkdir('app/templates');

            this.src.copy('_package.json', 'package.json');
            this.src.copy('_bower.json', 'bower.json');
        },

        projectfiles: function() {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function() {
        this.installDependencies();
    }
});

DjangoKaijuGenerator.prototype.isValidDjangoApp = function() {
    var isValid = true;

    isValid = fs.existsSync(path.join(this.destinationRoot(), 'manage.py'));
    isValid = fs.existsSync(path.join(this.destinationRoot(), this.projectName, '__init__.py'));
    isValid = fs.existsSync(path.join(this.destinationRoot(), this.projectName, 'settings.py'));

    return isValid;
};

module.exports = DjangoKaijuGenerator;
