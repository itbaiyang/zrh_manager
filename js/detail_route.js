/**
 * Created by baiyang on 2016/7/7.
 */
//路由设定
detail_app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
        .otherwise('/login');
    $stateProvider
        .state("apply", {
            url: '/apply',
            views: {
                '': {
                    templateUrl: templates_root + 'detail/index.html',
                },
                'top_bar@apply': {
                    templateUrl: templates_root + 'bar/top_bar.html',
                },
                'contains@apply': {
                    templateUrl: templates_root + 'detail/apply_detail.html',
                    controller: 'DetailAppCtrl'
                }
            }
        })
        .state("apply.detail", {
            url: '/detail/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/apply_detail.html',
                    controller: 'DetailAppCtrl'
                }
            }
        })
        .state('apply.edit_apply', {
            url: '/edit_apply/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/edit_apply.html',
                    controller: 'EditApplyCtrl'
                }
            }
        })
        .state('apply.distribute', {
            url: '/distribute/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/distribute.html',
                    controller: 'DistributeCtrl'
                }
            }
        })
        .state('apply.apply_help', {
            url: '/apply_help/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/apply_help.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('apply.change_bank', {
            url: '/change_bank/:id/:mobile',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/change_bank.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('apply.change_register', {
            url: '/change_register/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/change.html',
                    controller: 'ChangeRegisterCtrl'
                }
            }
        })
        .state('apply.message', {
            url: '/message/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/message.html',
                    controller: 'MessageCtrl'
                }
            }
        })
        .state('apply.choice_sale', {
            url: '/choice_sale/:id',
            views: {
                'contains@apply': {
                    templateUrl: templates_root + 'detail/choice_sale.html',
                    controller: 'ChoiceSaleCtrl'
                }
            }
        })
});