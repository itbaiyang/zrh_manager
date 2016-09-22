/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location) {

    /*回到首页*/
    $scope.go_home = function () {
        if ($rootScope.role != 'manager') {
            $location.path($rootScope.role);
        } else {
            $location.path("admin");
        }

    }

    /*退出程序*/
    $scope.exit = function () {
        $rootScope.removeObject("login_user");
        $location.path('/login');
    };
});

topBarCtrl.controller('SideBarCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {

    /*获取数据*/
    // $scope.message = function () {
    //     var m_params = {
    //         "userId": $rootScope.login_user.userId,
    //         "token": $rootScope.login_user.token,
    //     };
    //     $http({
    //         url: api_uri + "zrh/message/counts",
    //         method: "GET",
    //         params: m_params
    //     }).success(function (d) {
    //         if (d.returnCode == 0) {
    //             $scope.system_message = d.result;
    //         }
    //         else {
    //         }
    //
    //     }).error(function (d) {
    //     })
    // };

});


topBarCtrl.controller('ContainsCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {

    /*获取数据*/
    $scope.get_count = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "zrh/index/count",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.countContain = d.result;
        }).error(function (d) {
        });
    };
    $scope.get_group_count = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "zrh/group/groupCountByUser",
            method: "GET",
            params: m_params
        }).success(function (d) {

            if (d.returnCode == 0) {
                $scope.countGroup = d.result;
            } else if (d.returnCode == 1003) {
                console.log("用户或分组不存在");
            } else {
                console.log(d);
            }
        }).error(function (d) {
        });
    };
    $scope.get_count();
    $scope.get_group_count();
});
