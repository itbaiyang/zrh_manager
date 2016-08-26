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
                    templateUrl: templates_root + 'admin/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@super': {
                    templateUrl: templates_root + 'super/side_bar.html',
                    //controller: 'TopBarCtrl'
                },
                'sign_up@super': {
                    templateUrl: templates_root + 'super/user_list.html',
                    controller: 'UserListCtrl'
                }
            }
        })
        .state("super.addUser", {
            url: '/add_user',
            views: {
                'sign_up@super': {
                    templateUrl: templates_root + 'super/add_user.html',
                    controller: 'CreateUserCtrl'
                }
            }
        })
        .state("super.update", {
            url: '/update/:id',
            views: {
                'sign_up@super': {
                    templateUrl: templates_root + 'super/user_update.html',
                    controller: 'UserUpdateCtrl'
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
                    templateUrl: templates_root + 'admin/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@master': {
                    templateUrl: templates_root + 'admin/side_bar.html',
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

        .state('master.product', {
            url: '/product',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/product/product.html',
                    controller:'ProductCtrl'
                }
            }
        })
        .state('master.product.create', {
            url: '/create',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/product/create.html',
                    controller:'ProductCreateCtrl'
                }
            }
        })
        .state('master.product.update', {
            url: '/update/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/product/update.html',
                    controller:'ProductUpdateCtrl'
                }
            }
        })
        .state('master.product.sort', {
            url: '/sort',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/product/sort.html',
                    controller:'SortCtrl'
                }
            }
        })

        .state('master.signUp', {
            url: '/signUp',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/sign_up.html',
                    controller: 'SignUpCtrl'
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

        .state('master.bank', {
            url: '/bank',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/bank/bank.html',
                    controller: 'BankCtrl'
                }
            }
        })
        .state('master.bank.bank_man', {
            params: {
                "id": null,
                "name": null
            },
            url: '/bank_man/:id/:name',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/bank/bank_man.html',
                    controller: 'BankManCtrl'
                }
            }
        })
        .state('master.bank.add_bank', {
            params: {
                "id": null,
                "name": null
            },
            url: '/add_bank/:id/:name',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/bank/add_bank.html',
                    controller: 'AddBankCtrl'
                }
            }
        })
        .state('master.bank.add_bank_man', {
            url: '/add_bank_man/:id/:name',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/bank/add_bank_man.html',
                    controller: 'AddBankManCtrl'
                }
            }
        })
        .state('master.bank.update', {
            url: '/update/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/bank/update.html',
                    controller: 'UpdateBankCtrl'
                }
            }
        })
        .state('master.bank.update_bank_man', {
            url: '/update_bank_man/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/product_service/bank/update_bank_man.html',
                    controller: 'UpdateBankManCtrl'
                }
            }
        })

        .state('master.statistics', {
            url: '/statistics',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/statistics.html',
                    controller:'StatisticsCtrl'
                }
            }
        })
        .state('master.statistics.person', {
            url: '/person',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/person.html',
                    controller:'PersonCtrl'
                }
            }
        })
        .state('master.statistics.channel', {
            url: '/channel',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/channel.html',
                    controller:'ChannelCtrl'
                }
            }
        })
        .state('master.statistics.channel.create', {
            url: '/create',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/create.html',
                    controller:'CreateCtrl'
                }
            }
        })
        .state('master.statistics.channel.detail', {
            url: '/detail/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/detail.html',
                    controller:'ChannelDetailCtrl'
                }
            }
        })
        .state('master.statistics.channel.add_apply', {
            url: '/add_apply/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/add_apply.html',
                    controller:'AddApplyCtrl'
                }
            }
        })
        
        .state('master.statistics.share', {
            url: '/share',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/share.html',
                    controller:'ShareCtrl'
                }
            }
        })
        .state('master.statistics.share.share_detail', {
            url: '/share_detail/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'admin/statistics/share/share_detail.html',
                    controller:'ShareDetailCtrl'
                }
            }
        })

        // .state('master.account', {
        //     url: '/statistics',
        //     views: {
        //         'contains@master': {
        //             templateUrl: templates_root + 'admin/user_center/statistics/share/statistics1.html',
        //             //controller:'AccountCtrl'
        //         }
        //     }
        // })

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