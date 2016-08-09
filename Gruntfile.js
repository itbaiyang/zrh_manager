module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {

            js: {
                options: {
                    separator: ';'
                },
                src: [
                    'js/controller/login.js',
                    'js/controller/top_bar.js',
                    'js/controller/product.js',
                    'js/controller/company_message.js',
                    'js/controller/my_project.js',
                    'js/controller/super.js',
                    'js/controller/sign_up.js',
                    'js/controller/bank.js',
                    'js/controller/message.js',
                    'js/app.js',
                    'js/route.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            css: {
                src: [
                    ['css/*.css'],
                ],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.css'
            }
        },
        cssmin: {
            css: {
                src: 'dist/<%= pkg.name %>.<%= pkg.version %>.css',
                dest: 'dist/<%= pkg.name %>.min.<%= pkg.version %>.css'
            }
        },
        uglify: {
            options: {
                mangle: false, //不混淆变量名
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.<%= pkg.version %>.js': ['<%= concat.js.dest %>']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-css');

    //grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};