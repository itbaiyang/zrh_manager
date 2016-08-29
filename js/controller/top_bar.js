/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.exit = function () {
        $rootScope.removeObject("login_user");
        $location.path('/login');
    };
    $scope.message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "zrh/message/counts",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.count = d.result;
                console.log(d.result);
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
        })
    };
    $scope.message();
});

topBarCtrl.controller('SideBarCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {

});


topBarCtrl.controller('ContainsCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    var m_params = {
        "userId": $rootScope.login_user.userId,
        "token": $rootScope.login_user.token,
    };
    $http({
        url: api_uri + "p/user/detail/" + $rootScope.login_user.userId,
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
