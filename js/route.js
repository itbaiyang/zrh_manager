/**
 * Created by baiyang on 2016/7/7.
 */
//路由设定
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
        .otherwise('/login');
    $stateProvider
        .state("login", {
            url: '/login',
            views: {
                '': {
                    templateUrl: templates_root + 'login/index.html',
                    controller: 'LoginCtrl'
                },
            }
        })

        .state("super", {
            url: '/super',
            views: {
                '': {
                    templateUrl: templates_root + 'super/index.html',
                    //controller: 'UserIndexController'
                },
                'top_bar@super': {
                    templateUrl: templates_root + 'bar/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/side_bar.html',
                    //controller: 'TopBarCtrl'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/main.html',
                    // controller: 'UserListCtrl'
                }
            }
        })

        .state('super.manage', {
            url: '/manage',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/user_list.html',
                    controller: 'UserListCtrl'
                }
            }
        })
        .state("super.manage.addUser", {
            url: '/add_user',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/add_user.html',
                    controller: 'CreateUserCtrl'
                }
            }
        })
        .state("super.manage.update", {
            url: '/update/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/user_update.html',
                    controller: 'UserUpdateCtrl'
                }
            }
        })

        .state('super.product', {
            url: '/product',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/product.html',
                    controller: 'ProductCtrl'
                }
            }
        })
        .state('super.product.create', {
            url: '/create',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/create.html',
                    controller: 'ProductCreateCtrl'
                }
            }
        })
        .state('super.product.update', {
            url: '/update/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/update.html',
                    controller: 'ProductUpdateCtrl'
                }
            }
        })
        .state('super.product.sort', {
            url: '/sort',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/sort.html',
                    controller: 'SortCtrl'
                }
            }
        })

        .state('super.bank', {
            url: '/bank',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/bank.html',
                    controller: 'BankCtrl'
                }
            }
        })
        .state('super.bank.bank_man', {
            params: {
                "id": null,
                "name": null
            },
            url: '/bank_man/:id/:name',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/bank_man.html',
                    controller: 'BankManCtrl'
                }
            }
        })
        .state('super.bank.add_bank', {
            params: {
                "id": null,
                "name": null
            },
            url: '/add_bank/:id/:name',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank.html',
                    controller: 'AddBankCtrl'
                }
            }
        })
        .state('super.bank.add_bank_man', {
            url: '/add_bank_man/:id/:name',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank_man.html',
                    controller: 'AddBankManCtrl'
                }
            }
        })
        .state('super.bank.update', {
            url: '/update/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/update.html',
                    controller: 'UpdateBankCtrl'
                }
            }
        })
        .state('super.bank.update_bank_man', {
            url: '/update_bank_man/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/update_bank_man.html',
                    controller: 'UpdateBankManCtrl'
                }
            }
        })

        .state('super.signUp', {
            url: '/signUp',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/sign_up/sign_up.html',
                    controller: 'SignUpCtrl'
                }
            }
        })

        
        
        .state("master", {
            url: '/master',
            views: {
                '': {
                    templateUrl: templates_root + 'admin/index.html',
                    //controller: 'UserIndexController'
                },
                'top_bar@master': {
                    templateUrl: templates_root + 'bar/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@master': {
                    templateUrl: templates_root + 'bar/side_bar.html',
                    controller: 'SideBarCtrl'
                },
                'contains@master': {
                    templateUrl: templates_root + 'admin/contains.html',
                    controller: 'ContainsCtrl'
                }
            }
        })

        .state("master.company_message", {
            url: '/company_message',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/company_message/company_message.html',
                    controller: 'LoanApplicationCtrl'
                }
            }
        })
        .state('master.company_message.add_company', {
            url: '/add_company',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/company_message/add_company.html',
                    controller: 'AddCompanyCtrl'
                }
            }
        })

        .state('master.my_project', {
            url: '/my_project',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/my_project/my_project.html',
                    controller: 'MyProjectCtrl'
                }
            }
        })
        .state('master.my_project.detail', {
            url: '/detail/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/my_project/detail.html',
                    controller: 'DetailCtrl'
                }
            }
        })
        .state('master.my_project.edit_apply', {
            url: '/edit_apply/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/my_project/edit_apply.html',
                    controller: 'EditApplyCtrl'
                }
            }
        })
        .state('master.my_project.distribute', {
            url: '/distribute/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/my_project/distribute.html',
                    controller: 'DistributeCtrl'
                }
            }
        })
        .state('master.my_project.apply_help', {
            url: '/apply_help/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/my_project/apply_help.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('master.my_project.apply_again', {
            url: '/apply_again/:id/:mobile',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/my_project/apply_again.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })

        .state('master.statistics', {
            url: '/statistics',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/statistics.html',
                    // controller:'StatisticsCtrl'
                }
            }
        })
        .state('master.statistics.person', {
            url: '/person',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/person.html',
                    // controller:'PersonCtrl'
                }
            }
        })
        .state('master.channel', {
            url: '/channel',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/channel/channel.html',
                    controller:'ChannelCtrl'
                }
            }
        })
        .state('master.channel.create', {
            url: '/create',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/channel/create.html',
                    controller:'CreateCtrl'
                }
            }
        })
        .state('master.channel.detail', {
            url: '/detail/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/channel/detail.html',
                    controller:'ChannelDetailCtrl'
                }
            }
        })
        .state('master.channel.add_apply', {
            url: '/add_apply/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/channel/add_apply.html',
                    controller:'AddApplyCtrl'
                }
            }
        })

        .state('master.share', {
            url: '/share',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/share/share.html',
                    controller:'ShareCtrl'
                }
            }
        })
        .state('master.share.share_detail', {
            url: '/share_detail/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/share/share_detail.html',
                    controller:'ShareDetailCtrl'
                }
            }
        })

        .state('master.message', {
            url: '/message',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/user_center/message/message.html',
                    //controller: 'MessageCtrl'
                }
            }
        })
        .state('master.message.company', {
            url: '/company',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/user_center/message/company.html',
                    //controller:'MessageCompanyCtrl'
                }
            }
        })
        .state('master.message.bank', {
            url: '/bank',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/user_center/message/bank.html',
                    controller: 'MessageBankCtrl'
                }
            }
        })
        .state('master.message.apply', {
            url: '/apply',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/user_center/message/apply.html',
                    //controller:'MessageApplyCtrl'
                }
            }
        })
        .state('master.message.system', {
            url: '/system',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/user_center/message/system.html',
                    controller: 'MessageSystemCtrl'
                }
            }
        })
});