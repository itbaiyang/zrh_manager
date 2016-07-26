/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
   /* $scope.to_company_message = function(){
        $location.path('/company_message');
    };
    $scope.to_product = function(){
        $location.path('/product');
    };*/
    $scope.exit = function () {
        $rootScope.removeObject("login_user");
        $location.path('/login');
    };
});

topBarCtrl.controller('SideBarCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {
    $scope.$state = $state;
});


topBarCtrl.controller('ContainsCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    var login_user = $rootScope.getObject("login_user");
    var m_params = {
        "userId": login_user.userId,
        "token": login_user.token,
    };
    $http({
        url: api_uri + "p/user/detail/" + login_user.userId,
        method: "GET",
        params: m_params
    }).success(function (d) {
        console.log(d);

    }).error(function (d) {
        console.log(d);
    });
    $http({
        url: api_uri + "zrh/index/count",
        method: "GET",
        params: m_params
    }).success(function (d) {
        console.log(d);
        $scope.count = d.result;

    }).error(function (d) {
        console.log(d);
    });

});
