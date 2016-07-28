var messageCtrl = angular.module('messageCtrl', []);
messageCtrl.controller('MessageBankCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    var login_user = $rootScope.getObject("login_user");
    $scope.init = function () {
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
        };
        $http({
            url: api_uri + "applyBankDeal/manage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            $scope.message_list = d.result.datas;
            console.log(d);

        }).error(function (d) {
            console.log(d);
        });
    };
    $scope.init();
    $scope.showAllow = [];
    $scope.show_allow = function (status, id) {
        $scope.showAllow[id] = true;
        $scope.status = status;
        console.log($scope.status);
        if (status == 2) {
            $scope.statusText = "审核中";
        } else if (status == 3) {
            $scope.statusText = "跟进中";
        } else if (status == 4) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.choiceStatus = function (status) {
        $scope.status = status;
        if (status == 2) {
            $scope.statusText = "审核中";
        } else if (status == 3) {
            $scope.statusText = "跟进中";
        } else if (status == 4) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.cancel = function (id) {
        $scope.showAllow[id] = false;
    };
    $scope.allow = function (days, id, index) {
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "status": $scope.status,
            "dayNum": days,
            "id": id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "applyBankDeal/manage/allow",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.showAllow[index] = false;

        }).error(function (d) {
            console.log(d);
        });
    };
    $scope.refuse = function (id) {
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "id": id,
            "reason": "不行",
        };
        console.log(m_params);
        $http({
            url: api_uri + "applyBankDeal/manage/refuse",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);

        }).error(function (d) {
            console.log(d);
        });
    }
});
