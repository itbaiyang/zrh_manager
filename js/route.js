/**
 * Created by jiangzhuang on 5/5/16.
 */

//路由设定
myApp.config(function ($routeProvider) {
    $routeProvider
        //登录
        .when('/release', {
            templateUrl: templates_root + 'article/release.html',
            controller: 'ReleaseCtrl'
        })
        .when('/create', {
            templateUrl: templates_root + 'article/create.html',
            controller: 'CreateCtrl'
        })
        .when('/loanApplication', {
            templateUrl: templates_root + 'article/loan_application.html',
            controller: 'LoanApplicationCtrl'
        })
        .otherwise({redirectTo: '/release'})
});