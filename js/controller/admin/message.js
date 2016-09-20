var messageCtrl = angular.module('messageCtrl', []);
messageCtrl.controller('MessageBankCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    /*获取银行消息列表*/
    $scope.bank_list = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "applyBankDeal/manage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $scope.message_list = d.result.datas;
            angular.forEach($scope.message_list, function (data) {
                //$scope.status = d.result.status;
                data.dayNum = ''
                if (data.status == 0) {
                    data.progressText = "未申请";
                } else if (data.status == 1) {
                    data.progressText = "约见中";
                    data.progressTextNext = "申请中";
                    data.jindu = 20;
                    data.jindu_next = 30;
                } else if (data.status == 2) {
                    data.progressText = "申请中";
                    data.progressTextNext = "约见中";
                    data.jindu = 20;
                    data.jindu_next = 30;
                } else if (data.status == 3) {
                    data.progressText = "约见中";
                    data.progressTextNext = "跟进中";
                    data.jindu = 50;
                    data.jindu_next = 25;
                } else if (data.status == 4) {
                    data.progressText = "跟进中";
                    data.progressTextNext = "成功融资";
                    data.progressBtn = "已结束";
                    data.jindu = 75;
                    data.jindu_next = 25;
                } else if (data.status == -1) {
                    data.progressText = "申请取消";
                }
            });

        }).error(function (d) {
            // console.log(d);
        });
    };
    $scope.bank_list();

    /*显示窗口*/
    $scope.showAllow = []; //初始化参数
    $scope.show_allow = function (status, id) { //显示窗口函数
        $scope.showAllow[id] = true;
        $scope.status = status;
        if (status == 2) {
            $scope.statusText = "约见中";
        } else if (status == 3) {
            $scope.statusText = "跟进中";
        } else if (status == 4) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.choiceStatus = function (status) {  //选择状态
        $scope.status = status;
        if (status == 2) {
            $scope.statusText = "约见中";
        } else if (status == 3) {
            $scope.statusText = "跟进中";
        } else if (status == 4) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.cancel = function (id) { //关闭窗口
        $scope.showAllow[id] = false;
    };

    /*同意客户经理的请求*/
    $scope.allow = function (dayNum, id, index) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "status": $scope.status,
            "dayNum": dayNum,
            "id": id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "applyBankDeal/manage/allow",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $rootScope.successMsg = "通过已发送";
                $rootScope.fadeInOut("#alert", 500);
                $scope.showAllow[index] = false;
                $scope.bank_list();
                $rootScope.message();
                $scope.$apply();
            } else if (d.returnCode == 1002 && d.result == "abd") {
                alert("这条操作已经操作过了")
            } else if (data.returnCode == 1002 && d.result == "la") {
                alert("申请的状态错误")
            } else {
                alert("未知错误");
            }

        }).error(function (d) {
            // console.log(d);
        });
    };

    /*拒绝客户经理的请求*/
    $scope.refuse = function (id) {
        $scope.reason_refuse = $("#reason_refuse").val();
        // console.log($scope.reason_refuse);
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
            "reason": $scope.reason_refuse,
        };
        // console.log(m_params);
        $http({
            url: api_uri + "applyBankDeal/manage/refuse",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $rootScope.successMsg = "驳回已发送";
                $rootScope.fadeInOut("#alert", 500);
                $scope.showAllow[index] = false;
                $scope.bank_list();
                $rootScope.message();
                $scope.$apply();
            } else if (d.returnCode == 1002 && d.result == "abd") {
                alert("这条操作已经操作过了")
            } else if (data.returnCode == 1002 && d.result == "la") {
                alert("申请的状态错误")
            } else {
                alert("未知错误");
            }
        }).error(function (d) {
            // console.log(d);
        });
    }
});

messageCtrl.controller('MessageSystemCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.list = function (pageNo,pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "zrh/message/lists",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $scope.page = d.result;
            $scope.result_list = d.result.datas;
        }).error(function (d) {
            // console.log(d);
        });
    };
    $scope.list(1,20);
    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        // console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.to_company_message = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
        };
        $http({
            url: api_uri + "zrh/message/details",
            method: "GET", 
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $location.path('/admin/company_message');
        }).error(function (d) {
            // console.log(d);
        });
    };
});