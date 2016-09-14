/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location) {

    $scope.go_home = function () {
        if ($rootScope.role != 'manager') {
            $location.path($rootScope.role);
        } else {
            $location.path("admin");
        }

    }
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
            // url: api_uri + "zrh/index/message",
            url: api_uri + "applyBankDeal/manage/count",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $rootScope.count = d.result;
            }
            else {
            }

        }).error(function (d) {
        })
    };
    $scope.message();
});

topBarCtrl.controller('SideBarCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {
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
                $scope.system_message = d.result;
            }
            else {
            }

        }).error(function (d) {
        })
    };
});


topBarCtrl.controller('ContainsCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    var m_params = {
        "userId": $rootScope.login_user.userId,
        "token": $rootScope.login_user.token,
    };
    $http({
        url: api_uri + "zrh/index/groupCount",
        method: "GET",
        params: m_params
    }).success(function (d) {
        $scope.countGroup = d.result;
    }).error(function (d) {
    });
    $http({
        url: api_uri + "zrh/index/count",
        method: "GET",
        params: m_params
    }).success(function (d) {
        // console.log(d);
        $scope.count = d.result;

    }).error(function (d) {
    });

});
