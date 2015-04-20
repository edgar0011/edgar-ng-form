module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);


    // Build configuration
    var config = {
        app: 'app', //application source code folder
        dist: 'dist', //application distribution folder
        temp: 'temp' //temp dir for concat, uglify
    };


    grunt.initConfig({
        config:config,
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['<%= config.dist %>/*']
                    }
                ]
            },
            release: {
                files: [
                    {
                        dot: true,
                        src: [
                            'temp',
                            '<%= config.dist %>/temp',
                            '<%= config.dist %>/polyfills',
                            '<%= config.dist %>/angular-polyfills',
                            '<%= config.dist %>/**/*.js',
                            '!<%= config.dist %>/docs',
                            '!<%= config.dist %>/*.js',
                            '!<%= config.dist %>/*.min.js',
                            '<%= config.dist %>/components',
                            '<%= config.dist %>/modules',
                            '!<%= config.dist %>/assets/**/*.js'
                        ]
                    }
                ]
            },
            docs: {
                files: [
                    {src: "docs"}
                ]
            }

        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    '<%= config.dist %>/<%= config.temp %>/components/**/*.js',
                    '<%= config.dist %>/<%= config.temp %>/**/*.js'

                ],
                dest: '<%= config.dist %>/<%= config.temp %>/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                mangle: false,
                flatten: true
            },
            dist: {
                files: {
                    '<%= config.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', '<%= config.app %>/components/**/*.js', '<%= config.app %>/modules/**/*.js', '<%= config.app %>/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        wrap: {
            dist: {
                src: ['<%= config.dist %>/<%= config.temp %>/**/*.js'],
                dest: "",
                options: {
                    wrapper: ['(function () {\n\'use strict\'; \n', '\n})();']
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            default: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/<%= config.temp %>/**/*.js'],
                        /*dest: '<%= config.dist %>/',
                        ext: '.annotated.js', // Dest filepaths will have this extension.*/
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },

        less: {
            style: {
                files: [
                    {
                        '<%= config.app %>/styles/main.css': '<%= config.app %>/less/main.less'
                    }
                ]
            }
        },

        ngtemplates:  {
            "ed.ui":        {
                cwd:      '<%= config.app %>',
                src:      'components/**/*.html',
                dest:     '<%= config.dist %>/<%= config.temp %>/app.templates.js'
            }
        },

        copy: {

            release: {
                files: [

                    {expand:true, cwd: '<%= config.app %>', src:['*.js'], dest:'<%= config.dist %>/<%= config.temp %>'},

                    {expand:true, cwd: '<%= config.app %>', src:['assets/**/*.*'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['styles/**/*.css'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['data/**/*.*'], dest:'<%= config.dist %>'},

                    {expand:true, cwd: '<%= config.app %>', src:['components/**/*.html'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['components/**/*.js'], dest:'<%= config.dist %>/<%= config.temp %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['modules/**/*.js'], dest:'<%= config.dist %>/<%= config.temp %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['modules/**/*.html'], dest:'<%= config.dist %>'}

                ]
            },
            releaseSpecial:{
                files: [

                    {
                        expand:false,
                        src:['<%= concat.dist.dest %>'],
                        dest:'<%= config.dist %>/<%= pkg.name %>.min.js'

                    }
                ]
            }
        }

    });

    grunt.registerTask('release', function () {
        grunt.task.run([
            'clean:dist',
            'ngtemplates',
            'jshint',
            'copy:release',

            'wrap:dist',
            'ngAnnotate',

            'concat',
            'uglify',
            //'copy:releaseSpecial',
            'clean:release'
        ]);
    });
};