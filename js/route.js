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
        .state("master", {
            url: '/master',
            views: {
                '': {
                    templateUrl: templates_root + 'master/index.html',
                    //controller: 'UserIndexController'
                },
                'top_bar@master': {
                    templateUrl: templates_root + 'master/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@master': {
                    templateUrl: templates_root + 'master/side_bar.html',
                    controller: 'SideBarCtrl'
                },
                'contains@master': {
                    templateUrl: templates_root + 'master/contains.html',
                    //controller: 'ContainsCtrl'
                }
            }
        })
        .state("master.contains", {
            url: '/contains',
            views: {
                '': {
                    templateUrl: templates_root + 'master/contains.html',
                    //controller: 'UserIndexController'
                }
            }
        })
        .state("master.company_message", {
            url: '/company_message',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'master/company_message.html',
                    controller: 'LoanApplicationCtrl'
                }
            }
        })
        .state('master.product', {
            url: '/product',
            views: {
                'contains@master': {
                    templateUrl:templates_root + 'master/product.html',
                    controller:'ProductCtrl'
                }
            }
        })
        .state('master.product.create', {
            url: '/create',
            views: {
                'contains@master': {
                    templateUrl:templates_root + 'master/create.html',
                    controller:'ProductCreateCtrl'
                }
            }
        })
        .state('master.product.update', {
            url: '/update/:id',
            views: {
                'contains@master': {
                    templateUrl:templates_root + 'master/update.html',
                    controller:'ProductUpdateCtrl'
                }
            }
        })
        .state('master.person_baojuan.add_company', {
            url: '/add_company',
            views: {
                'contains@master': {
                    templateUrl:templates_root + 'master/add_company.html',
                    controller: 'AddCompanyCtrl'
                }
            }
        })
        .state('master.person_baojuan.edit_apply', {
            url: '/edit_apply/:id',
            views: {
                'contains@master': {
                    templateUrl: templates_root + 'master/edit_apply.html',
                    controller: 'EditApplyCtrl'
                }
            }
        })
        .state('master.person_baojuan', {
            url: '/person_baojuan',
            views: {
                'contains@master': {
                    templateUrl:templates_root + 'master/person_baojuan.html',
                    controller:'PersonBjCtrl'
                }
            }
        })
        .state('master.signUp', {
            url: '/signUp',
            views: {
                'contains@master': {
                    templateUrl:templates_root + 'master/sign_up.html',
                    controller:'SignUpCtrl'
                }
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
                    templateUrl: templates_root + 'super/top_bar.html',
                    //controller: 'TopBarCtrl'
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
});