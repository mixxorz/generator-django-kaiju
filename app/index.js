'use strict';
var chalk = require('chalk');
var path = require('path');
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

    if (this.projectName) {
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
        name: 'Font Awesome',
        checked: true,
        value: 'fontawesome'
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
  writing: {
    djangoFiles: function() {
      // Base Django
      this.secretKey = require('crypto').randomBytes(Math.ceil(50 * 3 / 4)).toString('base64');
      this.dest.write(path.join(this.projectName, '__init__.py'), '');
      this.template('manage.py', 'manage.py');
      this.template('kaiju/urls.py', this.projectName + '/urls.py');
      this.template('kaiju/wsgi.py', this.projectName + '/wsgi.py');
      this.dest.mkdir(path.join(this.projectName, 'apps'));
      this.dest.write(path.join(this.projectName, 'apps', '__init__.py'), '');

      // Scaffold the core app
      this.dest.mkdir(path.join(this.projectName, 'apps', 'core'));
      this.dest.write(path.join(this.projectName, 'apps', 'core', '__init__.py'), '');
      this.src.copy('kaiju/apps/core/admin.py', this.projectName + '/apps/core/admin.py');
      this.src.copy('kaiju/apps/core/context_processors.py', this.projectName + '/apps/core/context_processors.py');
      this.src.copy('kaiju/apps/core/models.py', this.projectName + '/apps/core/models.py');
      this.src.copy('kaiju/apps/core/tests.py', this.projectName + '/apps/core/tests.py');
      this.src.copy('kaiju/apps/core/views.py', this.projectName + '/apps/core/views.py');
      this.dest.mkdir(path.join(this.projectName, 'apps', 'core', 'migrations'));
      this.dest.write(path.join(this.projectName, 'apps', 'core', 'migrations', '__init__.py'), '');
      this.template('kaiju/apps/core/templates/base.html', this.projectName + '/apps/core/templates/base.html');
      this.src.copy('kaiju/apps/core/templates/core/index.html', this.projectName + '/apps/core/templates/core/index.html');

      // Django settings
      this.dest.mkdir(path.join(this.projectName, 'settings'));
      this.dest.write(path.join(this.projectName, 'settings', '__init__.py'), '');
      this.template('kaiju/settings/base.py', this.projectName + '/settings/base.py');
      this.template('kaiju/settings/prod.py', this.projectName + '/settings/prod.py');
      this.template('kaiju/settings/dev.py', this.projectName + '/settings/dev.py');
    },
    projectFiles: function() {
      this.template('.bowerrc', '.bowerrc');
      this.src.copy('.editorconfig', '.editorconfig');
      this.src.copy('.gitignore', '.gitignore');
      this.src.copy('.jshintrc', '.jshintrc');
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
      this.template('package.json', 'package.json');
      this.template('README.md', 'README.md');
      this.dest.mkdir('requirements');
      this.template('requirements/base.txt', 'requirements/base.txt');
      this.src.copy('requirements/dev.txt', 'requirements/dev.txt');
      this.template('requirements/prod.txt', 'requirements/prod.txt');
    },
    foundationFiles: function() {
      this.src.copy('kaiju/apps/core/assets/.gitignore', this.projectName + '/apps/core/assets/.gitignore');
      if (this.features.indexOf('foundation') !== -1) {
        this.src.copy('kaiju/apps/core/assets/app/scss/app.scss', this.projectName + '/apps/core/assets/app/scss/app.scss');
        this.src.copy('kaiju/apps/core/assets/app/scss/_settings.scss', this.projectName + '/apps/core/assets/app/scss/_settings.scss');
        this.src.copy('kaiju/apps/core/assets/app/scss/_styles.scss', this.projectName + '/apps/core/assets/app/scss/_styles.scss');
        this.src.copy('kaiju/apps/core/assets/app/js/app.js', this.projectName + '/apps/core/assets/app/js/app.js');
      } else {
        this.dest.write(this.projectName + '/apps/core/assets/app/scss/app.scss', '// Your sass styles go here');
        this.dest.write(this.projectName + '/apps/core/assets/app/js/app.js', '// Your scripts go here');
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
  },

  end: function() {
    if (!this.options['skip-install']) {
      this.installDependencies();
      this.log(chalk.yellow('Also installing Python dependencies with pip.'));
      this.spawnCommand('pip install -r requirements/dev.txt');
    }
  }
});

module.exports = DjangoKaijuGenerator;
