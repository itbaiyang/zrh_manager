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
            console.log(d);
            $scope.message_list = d.result.datas;
            angular.forEach($scope.message_list, function (data) {
                //$scope.status = d.result.status;
                if (data.status == 0) {
                    data.progressText = "未申请";
                } else if (data.status == 1) {
                    data.progressText = "约见中";
                    data.jindu = 20;
                    data.jindu_next = 30;
                } else if (data.status == 2) {
                    data.progressText = "审核中";
                    data.jindu = 50;
                    data.jindu_next = 25;
                } else if (data.status == 3) {
                    data.progressText = "跟进中";
                    data.jindu = 75;
                    data.jindu_next = 25;
                } else if (data.status == 4) {
                    data.progressText = "成功融资";
                    data.progressBtn = "已结束";
                    data.jindu = 100;
                } else if (data.status == -1) {
                    data.progressText = "申请取消";
                }
            });

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
        $scope.reason_refuse = $("#reason_refuse").val();
        console.log($scope.reason_refuse);
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "id": id,
            "reason": $scope.reason_refuse,
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

messageCtrl.controller('MessageSystemCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    var login_user = $rootScope.getObject("login_user");
    $scope.init = function () {
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
        };
        $http({
            url: api_uri + "zrh/message/lists",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.message_list = d.result.datas;
        }).error(function (d) {
            console.log(d);
        });
    };
    $scope.init();
});