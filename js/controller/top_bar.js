/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location) {

    $scope.go_home = function () {
        $location.path($rootScope.role);
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
            console.log(d);
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
    // $scope.message();
    // $scope.bank_message = function () {
    //     var m_params = {
    //         "userId": $rootScope.login_user.userId,
    //         "token": $rootScope.login_user.token,
    //     };
    //     $http({
    //         url: api_uri + "applyBankDeal/manage/count",
    //         method: "GET",
    //         params: m_params
    //     }).success(function (d) {
    //         if (d.returnCode == 0) {
    //             $scope.bank_message = d.result;
    //         }
    //         else {
    //         }
    //     }).error(function (d) {
    //     })
    // };
    // $scope.bank_message();
});


topBarCtrl.controller('ContainsCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    var m_params = {
        "userId": $rootScope.login_user.userId,
        "token": $rootScope.login_user.token,
    };
    // $http({
    //     url: api_uri + "p/user/detail/" + $rootScope.login_user.userId,
    //     method: "GET",
    //     params: m_params
    // }).success(function (d) {
    //     console.log(d);
    // }).error(function (d) {
    // });
    $http({
        url: api_uri + "zrh/index/count",
        method: "GET",
        params: m_params
    }).success(function (d) {
        console.log(d);
        $scope.count = d.result;

    }).error(function (d) {
    });

});
