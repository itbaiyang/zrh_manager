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
                    controller: 'SideBarCtrl'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/main.html',
                    // controller: 'UserListCtrl'
                }
            }
        })

        .state('super.apply_list', {
            url: '/apply_list',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/apply_list/apply_list.html',
                    controller: 'ApplyListCtrl'
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
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/add_user.html',
                    controller: 'CreateUserCtrl'
                }
            }
        })
        .state("super.manage.update", {
            url: '/update/:id',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/add_user.html',
                    controller: 'UserUpdateCtrl'
                }
            }
        })

        .state('super.team', {
            url: '/team',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/team/team.html',
                    controller: 'TeamCtrl'
                }
            }
        })
        .state('super.team.members', {
            url: '/members/:id',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/team/members.html',
                    controller: 'MembersCtrl'
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
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/create.html',
                    controller: 'ProductCreateCtrl'
                }
            }
        })
        .state('super.product.update', {
            url: '/update/:id',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/create.html',
                    controller: 'ProductUpdateCtrl'
                }
            }
        })
        .state('super.product.sort', {
            url: '/sort',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
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
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
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
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank.html',
                    controller: 'AddBankCtrl'
                }
            }
        })
        .state('super.bank.add_bank_man', {
            url: '/add_bank_man/:id/:name',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank_man.html',
                    controller: 'AddBankManCtrl'
                }
            }
        })
        .state('super.bank.update', {
            url: '/update/:id',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank.html',
                    controller: 'UpdateBankCtrl'
                }
            }
        })
        .state('super.bank.update_bank_man', {
            url: '/update_bank_man/:id/:name',
            views: {
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank_man.html',
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

        .state("admin", {
            url: '/admin',
            views: {
                '': {
                    templateUrl: templates_root + 'admin/index.html',
                    //controller: 'UserIndexController'
                },
                'top_bar@admin': {
                    templateUrl: templates_root + 'bar/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/side_bar.html',
                    controller: 'SideBarCtrl'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/contains.html',
                    controller: 'ContainsCtrl'
                }
            }
        })

        .state("admin.company_message", {
            url: '/company_message/:page/:wd/:status/:scroll',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/company_message/company_message.html',
                    controller: 'LoanApplicationCtrl'
                }
            },
            resolve: {
                page: ['$stateParams', function ($stateParams) {
                    return $stateParams.page;
                }],
                wd: ['$stateParams', function ($stateParams) {
                    return $stateParams.wd;
                }],
                status: ['$stateParams', function ($stateParams) {
                    return $stateParams.status;
                }],
                scroll: ['$stateParams', function ($stateParams) {
                    return $stateParams.scroll;
                }]
            }
        })
        .state('admin.company_message.detail', {
            url: '/detail/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/detail.html',
                    controller: 'DetailsCtrl'
                }
            }
        })
        .state('admin.company_message.add_company', {
            url: '/add_company',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/company_message/add_company.html',
                    controller: 'AddCompanyCtrl'
                }
            }
        })

        .state('admin.my_project', {
            url: '/my_project/:page/:wd/:status/:scroll',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/my_project.html',
                    controller: 'MyProjectCtrl'
                }
            },
            resolve: {
                page: ['$stateParams', function ($stateParams) {
                    return $stateParams.page;
                }],
                wd: ['$stateParams', function ($stateParams) {
                    return $stateParams.wd;
                }],
                status: ['$stateParams', function ($stateParams) {
                    return $stateParams.status;
                }]
            }
        })
        .state('admin.my_project.detail', {
            url: '/detail/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/detail.html',
                    controller: 'DetailCtrl'
                }
            }
        })
        .state('admin.my_project.edit_apply', {
            url: '/edit_apply/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/edit_apply.html',
                    controller: 'EditApplyCtrl'
                }
            }
        })
        .state('admin.my_project.distribute', {
            url: '/distribute/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/distribute.html',
                    controller: 'DistributeCtrl'
                }
            }
        })
        .state('admin.my_project.apply_help', {
            url: '/apply_help/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/apply_help.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('admin.my_project.change_bank', {
            url: '/change_bank/:id/:mobile',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/change_bank.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('admin.my_project.change_register', {
            url: '/change_register/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/change.html',
                    controller: 'ChangeRegisterCtrl'
                }
            }
        })
        .state('admin.my_project.message', {
            url: '/message/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/message.html',
                    controller: 'MessageCtrl'
                }
            }
        })
        .state('admin.my_project.choice_sale', {
            url: '/choice_sale/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/choice_sale.html',
                    controller: 'ChoiceSaleCtrl'
                }
            }
        })

        .state("admin.user_list", {
            url: '/user_list',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'manager/user_list.html',
                    controller: 'SaleManagerCtrl'
                }
            }
        })
        .state("admin.user_list.sale_apply_list", {
            url: '/sale_apply_list/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'manager/sale_apply_list.html',
                    controller: 'SaleApplyListCtrl'
                }
            }
        })

        .state('admin.channel', {
            url: '/channel',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/channel.html',
                    controller:'ChannelCtrl'
                }
            }
        })
        .state('admin.channel.create', {
            url: '/create',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/create.html',
                    controller:'CreateCtrl'
                }
            }
        })
        .state('admin.channel.detail', {
            url: '/detail/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/detail.html',
                    controller:'ChannelDetailCtrl'
                }
            }
        })
        .state('admin.channel.add_apply', {
            url: '/add_apply/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/add_apply.html',
                    controller:'AddApplyCtrl'
                }
            }
        })
        .state('admin.channel.history', {
            url: '/history/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/history.html',
                    controller: 'HistoryCtrl'
                }
            }
        })
        .state('admin.channel.change', {
            url: '/change/:id/:idt',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/change.html',
                    controller: 'ChangeCtrl'
                }
            }
        })

        .state('admin.share', {
            url: '/share',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/share/share.html',
                    controller:'ShareCtrl'
                }
            }
        })
        .state('admin.share.share_detail', {
            url: '/share_detail/:id',
            views: {
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/no_side.html'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/share/share_detail.html',
                    controller:'ShareDetailCtrl'
                }
            }
        })

        // .state('admin.account', {
        //     url: '/account',
        //     views: {
        //         'contains@admin': {
        //             templateUrl: templates_root + 'admin/user_center/account/account.html',
        //             controller: 'AccountCtrl'
        //         }
        //     }
        // })
        .state('admin.message', {
            url: '/message',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/message.html',
                    //controller: 'MessageCtrl'
                }
            }
        })
        .state('admin.message.company', {
            url: '/company',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/company.html',
                    //controller:'MessageCompanyCtrl'
                }
            }
        })
        .state('admin.message.bank', {
            url: '/bank',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/bank.html',
                    controller: 'MessageBankCtrl'
                }
            }
        })
        .state('admin.message.apply', {
            url: '/apply',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/apply.html',
                    //controller:'MessageApplyCtrl'
                }
            }
        })
        .state('admin.message.system', {
            url: '/system',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/system.html',
                    controller: 'MessageSystemCtrl'
                }
            }
        })
});