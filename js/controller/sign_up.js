/**
 * Created by baiyang on 2016/7/11.
 */
var signUpCtrl = angular.module('signUpCtrl', []);
signUpCtrl.controller('SignUpCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            pageNo: pageNo,
            pageSize: pageSize,
            "wd": $scope.wd
        };
        $http({
            url: api_uri + "p/user/listUsers",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                console.log(d);
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
            }
            else {
                console.log(d);
            }

        }).error(function (d) {
            console.log(d);
        })
    };

    $scope.list(1, 20);

    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.selected = [];
    $scope.ids = [];

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log("添加id" + $scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
            console.log("删除id" + id);
        }
    };

    $scope.refresh_user = function(){
        $scope.list($scope.pageNo1, 20);
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下");
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };
});