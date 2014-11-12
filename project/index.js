'use strict';
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

// Django 1.7.1
var DjangoKaijuProjectGenerator = yeoman.generators.Base.extend({
  // Override constructor
  constructor: function() {
    // Calling the super constructor is important so our generator is correctly setup
    yeoman.generators.Base.apply(this, arguments);

    this.argument('projectName', {
      desc: 'The name for your project',
      required: false,
      type: String
    });
  },
  initializing: function() {
    this.pkg = require('../package.json');

    if (this.projectName) {
      this.projectName = this.projectName;
      this.skipProjectNamePrompt = true;
    } else {
      this.projectName = process.cwd().split(path.sep).pop();
      this.skipProjectNamePrompt = false;
    }
  },
  prompting: function() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Yo Django Kaiju! Project'
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

    this.prompt(prompts, function(props) {
      this.projectName = props.projectName || this.projectName;

      done();
    }.bind(this));
  },
  writing: {
    djangoFiles: function() {
      //
      this.secretKey = require('crypto').randomBytes(Math.ceil(50 * 3 / 4)).toString('base64');
      this.dest.mkdir(this.projectName);
      this.template('projectName/__init__.py', this.projectName + '/__init__.py');
      this.template('projectName/settings.py', this.projectName + '/settings.py');
      this.template('projectName/urls.py', this.projectName + '/urls.py');
      this.template('projectName/wsgi.py', this.projectName + '/wsgi.py');
      this.template('manage.py', 'manage.py');
    }
  },

  end: function() {

  },
});

module.exports = DjangoKaijuProjectGenerator;
