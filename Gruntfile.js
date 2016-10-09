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
                    'js/controller/super/apply_list.js',
                    'js/controller/super/product.js',
                    'js/controller/super/manage.js',
                    'js/controller/super/team.js',
                    'js/controller/super/sign_up.js',
                    'js/controller/super/bank.js',
                    'js/controller/admin/company_message.js',
                    'js/controller/admin/sale_manager.js',
                    'js/controller/admin/my_project.js',
                    'js/controller/admin/channel.js',
                    'js/controller/admin/share.js',
                    // 'js/controller/admin/account.js',
                    'js/controller/admin/message.js',
                    'js/app.js',
                    'js/animation.js',
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