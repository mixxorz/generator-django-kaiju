module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Change projectName to a different string value if your project name
        // Is not the name of the folder
        projectName: process.cwd().split(path.sep).pop(),
        base: '<%= projectName %>/apps/core/assets',
        app: '<%= base %>/app',
        dist: '<%= base %>/dist',
        build: '.build',

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/',
                    src: [
                        // Place css files that should be in their own
                        // minified css file here. e.g.
                        // 'bower_components/animate.css/animate.css'
                    ],
                    flatten: true,
                    dest: '<%= build %>/css/etc/'
                }, {
                    expand: true,
                    cwd: '<%= app %>/',
                    src: [
                        // Place js files that should be in their own
                        // minified js file here. e.g.
                        'bower_components/modernizr/modernizr.js'
                    ],
                    flatten: true,
                    dest: '<%= build %>/js/etc/'
                }, {
                    // Copy fonts
                    src: ['<%= app %>/fonts/**'],
                    dest: '<%= dist %>/'
                }, {
                    // Library fonts
                    expand: true,
                    flatten: true,
                    src: ['<%= app %>/bower_components/font-awesome/fonts/**'],
                    dest: '<%= dist %>/fonts/',
                    filter: 'isFile'
                }]
            }
        },

        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= build %>/',
                    src: 'css/*.css',
                    dest: '<%= dist %>/css/',
                    flatten: true,
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            options: {
                mangle: false,
                preserveComments: 'some',
                compress: {
                    drop_console: true
                }
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= build %>/',
                    src: 'js/**/*.js',
                    dest: '<%= dist %>/js/',
                    flatten: true,
                    ext: '.min.js'
                }]
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            build: {
                files: {
                    // CSS Libraries
                    '<%= build %>/css/lib.css': [
                        // e.g. '<%= app %>/bower_components/animate.css/animate.css',
                    ],
                    // Your CSS files
                    '<%= build %>/css/app.css': [
                        '<%= app %>/css/**/*.css',
                    ],
                    // JavaScript Libraries
                    '<%= build %>/js/lib.js': [
                        '<%= app %>/bower_components/jquery/dist/jquery.js',
                        '<%= app %>/bower_components/fastclick/lib/fastclick.js'
                    ],
                    // Foundation JS files. Comment out files you don't need.
                    '<%= build %>/js/foundation.js': [
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.abide.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.accordion.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.alert.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.clearing.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.dropdown.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.equalizer.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.interchange.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.joyride.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.magellan.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.offcanvas.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.orbit.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.reveal.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.slider.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.tab.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.tooltip.js',
                        '<%= app %>/bower_components/foundation/js/foundation/foundation.topbar.js'
                    ],
                    // Your JS files
                    '<%= build %>/js/app.js': [
                        // NOTE: Order matters.
                        '<%= app %>/js/app.js'
                    ],
                }
            }
        },

        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/images/',
                    src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                    dest: '<%= dist %>/images/'
                }]
            }
        },

        clean: {
            build: [
                '<%= build %>/',
                '<%= dist %>/',
                // Don't clean these files because minifying them takes a while
                '!**/*.{jpg,gif,svg,jpeg,png}'
            ]
        },

        jshint: {
            options: {
                jshintrc: '<%= base %>/.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= app %>/js/**/*.js'
            ]
        },

        sass: {
            options: {
                includePaths: ['<%= app %>/bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'extended'
                },
                files: {
                    '<%= app %>/css/app.css': '<%= app %>/scss/app.scss'
                }
            }
        },

        concurrent: {
            target: {
                tasks: ['shell:runserver', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        shell: {
            runserver: {
                command: 'python manage.py runserver --settings=kaiju.settings.dev',
                options: {
                    stdout: true,
                    stdin: true,
                    stderr: true
                }
            }
        },

        watch: {
            sass: {
                files: '<%= app %>/scss/**/*.scss',
                tasks: ['sass']
            },
            livereload: {
                files: ['!<%= app %>/bower_components/**', '<%= app %>/js/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
                options: {
                    livereload: true
                }
            }
        },
    });

    // Default: Runs the django dev server and the grunt livereload server
    grunt.registerTask('default', ['concurrent']);

    // Copies fonts, optimizes images, concatenates and minifies css/js, all sent to dist/
    grunt.registerTask('build', ['clean', 'copy', 'concat', 'cssmin', 'uglify', 'newer:imagemin']);
};
