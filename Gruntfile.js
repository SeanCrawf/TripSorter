'use strict';

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates'
    });

    // Configurable paths for the application
    var projectPaths = {
        app: 'app',
        dist: 'dist',
        npm: 'node_modules'
    };

    var gruntConfig = function(){

        return {
            paths: projectPaths,

            watch: {
                sass_main: {
                    files: [
                        '<%= paths.app %>/css/scss/_*.scss',
                        '<%= paths.app %>/css/scss/main.scss'
                    ],
                    tasks: ["sass:main","postcss"],
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    }
                },
                typescript: {
                    files: [
                        '<%= paths.app %>/pipeline/**/*.ts',
                        '<%= paths.app %>/pipeline/Typings/**/*.d.ts'
                    ],
                    tasks: ['ts'],
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    }
                },
                ngtemplates:{
                    files: [
                        '<%= paths.app %>/pipeline/**/*.html',
                        '<%= paths.app %>/pipeline/Components/**/*.html'
                    ],
                    tasks: ['ngtemplates']
                },
                jasmine: {
                    files: ['<%= paths.app %>/pipeline/**/*.spec.js'],
                    tasks: ['jasmine']
                },
                gruntfile: {
                    files: ['Gruntfile.js']
                },
                livereload: {
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    },
                    files: [
                        '<%= paths.app %>/{,*/}*.html',
                        '<%= paths.app %>/js/*.js',
                        '<%= paths.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            },

            sass: {
                main: {
                    options: {// Target options
                        style: 'expanded'
                    },
                    src: [ '<%= paths.app %>/css/scss/main.scss'],
                    dest: '<%= paths.app %>/css/main.css'
                }
            },

            postcss: {
                options: {
                    map: {
                        inline: false, // save all sourcemaps as separate files...
                        annotation: 'dist/css/maps/' // ...to the specified directory
                    },
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                        require('cssnano')() // minify the result
                    ]
                },
                dist: {
                    src: '<%= paths.app %>/css/*.css'
                }
            },

            ts: {
                application : {
                    files: [
                        {
                            src: [
                                '<%= paths.app %>/pipeline/**/*.ts'
                            ],
                            dest: '<%= paths.app %>/js/app.js',
                            options: {
                                fast: 'never'
                            }
                        }
                    ]
                }
            },

            // The actual grunt server settings
            connect: {
                options:{
                    hostname: 'localhost',
                    port: 9000,
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: {
                            target: 'http://localhost:9000'
                        },
                        livereload: true,
                        base: '<%= paths.app %>',
                        middleware: function (connect) {
                            return [
                                connect.static(projectPaths.npm),
                                connect.static(projectPaths.app)
                            ];
                        }
                    }
                }
            },

            // run tests
            jasmine: {
                dist: {
                    src: '<%= paths.app %>/js/*.js',
                    options: {
                        specs: [
                            'app/pipeline/**/*.spec.js'
                        ],
                        vendor: [
                            'node_modules/underscore/underscore.js',
                            'node_modules/angular/angular.js',
                            'node_modules/angular-route/angular-route.js',
                            'node_modules/angular-mocks/angular-mocks.js'
                        ],
                        summary: false
                    }
                }
            },

            // Reads HTML for usemin blocks to enable smart builds that automatically
            // concat, minify and revision files. Creates configurations in memory so
            // additional tasks can operate on them
            useminPrepare: {
                html: ['<%= paths.app %>/index.html'],
                options: {
                    dest: '<%= paths.dist %>',
                    flow: {
                        html: {
                            steps: {
                                js: ['concat', 'uglifyjs'],
                                css: ['cssmin']
                            },
                            post: {}
                        }
                    }
                }
            },

            // Performs rewrites based on filerev and the useminPrepare configuration
            usemin: {
                html: ['<%= paths.dist %>/{,*/}*.html'],
                css: ['<%= paths.dist %>/css/{,*/}*.css'],
                js: ['<%= paths.dist %>/js/{,*/}*.js'],
                options: {
                    assetsDirs: [
                        '<%= paths.dist %>',
                        '<%= paths.dist %>/images',
                        '<%= paths.dist %>/css'
                    ],
                    patterns: {
                        js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                    }
                }
            },

            htmlmin: {
                dist: {
                    options: {
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        collapseBooleanAttributes: true,
                        removeCommentsFromCDATA: true
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= paths.dist %>',
                        src: ['*.html'],
                        dest: '<%= paths.dist %>'
                    }]
                }
            },

            ngtemplates: {
                app: {
                    options: {
                        htmlmin: '<%= htmlmin.dist.options %>',
                        bootstrap: function(module, script) {
                            return 'angular.module(App.name).run(["$templateCache", function($templateCache) {\n\n' + script + '\n\n}]);';
                        }
                    },
                    cwd: '<%= paths.app %>',
                    src: [ 'pipeline/**/*.html', 'pipeline/Components/**/*.html' ],
                    dest: '<%= paths.app %>/js/app.templates.js'
                }
            },

            // Empties folders to start fresh
            clean: {
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '<%= paths.dist %>/{,*/}*',
                            '!<%= paths.dist %>/.git{,*/}*'
                        ]
                    }]
                }
            },


            // Copies remaining files to places other tasks can use
            copy: {
                fonts: {
                    files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= paths.npm %>/bootstrap/dist/fonts/',
                        dest: '<%= paths.dist %>/fonts/',
                        src: [
                            '{,*/}*.*'
                        ]
                    }]
                },
                dist: {
                    files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= paths.app %>',
                        dest: '<%= paths.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'images/{,*/}*.{webp}',
                            'css/*.css',
                            'css/fonts/{,*/}*.*'
                        ]
                    }]
                }
            }

        };
    };

    // Define the configuration for all the tasks
    grunt.initConfig(gruntConfig());

    grunt.registerTask('make', function (target) {
        var makeType = target.split('@')[0];
        var makeName = target.split('@')[1];
        require('sublime-snippet-file-generator').generate(makeType,makeName);
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function () {
        grunt.task.run([
            'ts',
            'ngtemplates',
            'postcss',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', 'Build files for production', function(){
        grunt.task.run([
            'ts',
            'copy:fonts',
            'clean:dist',
            'useminPrepare',
            'postcss',
            'ngtemplates',
            'concat',
            'copy:dist',
            'cssmin',
            'uglify',
            'usemin',
            'htmlmin',
            'jasmine'
        ]);
    });
};
