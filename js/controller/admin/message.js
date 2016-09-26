var messageCtrl = angular.module('messageCtrl', []);
messageCtrl.controller('MessageBankCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    /*获取银行消息列表*/
    $scope.bank_list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "applyBankDeal/manage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.message_list = d.result.datas;
            angular.forEach($scope.message_list, function (data) {
                data.dayNum = '';
                if (data.status == 0) {
                    data.progressText = "未申请";
                } else if (data.status == 1) {
                    data.progressText = "准备中";
                    data.progressTextNext = "下户";
                    data.jindu = 15;
                    data.jindu_next = 10;
                    data.jindu_success = 25;
                } else if (data.status == 2) {
                    data.progressText = "下户";
                    data.progressTextNext = "审批中";
                    data.jindu = 25;
                    data.jindu_next = 15;
                    data.jindu_success = 40;
                } else if (data.status == 3) {
                    data.progressText = "审批中";
                    data.progressTextNext = "审批通过";
                    data.jindu = 40;
                    data.jindu_next = 15;
                    data.jindu_success = 55;
                } else if (data.status == 4) {
                    data.progressText = "审批通过";
                    data.progressTextNext = "开户";
                    data.jindu = 55;
                    data.jindu_next = 15;
                    data.jindu_success = 70;
                } else if (data.status == 5) {
                    data.progressText = "开户";
                    data.progressTextNext = "放款";
                    data.jindu = 70;
                    data.jindu_next = 15;
                    data.jindu_success = 85;
                } else if (data.status == 6) {
                    data.progressText = "放款";
                    data.progressTextNext = "成功融资";
                    data.jindu = 85;
                    data.jindu_next = 15;
                    data.jindu_success = 100;
                } else if (data.status == 7) {
                    data.progressText = "成功融资";
                    data.jindu = 100;
                } else if (data.status == -1) {
                    data.progressText = "申请取消";
                }
            });

        }).error(function (d) {
            // console.log(d);
        });
    };
    $scope.bank_list(1, 100);

    /*显示窗口*/
    $scope.showAllow = []; //初始化参数
    $scope.showRefuse = []; //初始化参数
    $scope.show_allow = function (status, id, type) { //显示窗口函数
        if (type == 0) {
            $scope.showAllow[id] = true;
            $scope.status = status;
            if (status == 2) {
                $scope.statusText = "下户";
                $scope.statusPro = "准备中";
            } else if (status == 3) {
                $scope.statusText = "审批中";
                $scope.statusPro = "下户";
            } else if (status == 4) {
                $scope.statusText = "审批通过";
                $scope.statusPro = "审批中";
            } else if (status == 5) {
                $scope.statusText = "开户";
                $scope.statusPro = "审批通过";
            } else if (status == 6) {
                $scope.statusText = "放款";
                $scope.statusPro = "审批通过";
            } else if (status == 7) {
                $scope.statusText = "成功融资";
                $scope.statusPro = "放款";
            }
            for (var i = 0; i < $scope.showRefuse.length; i++) {
                $scope.showRefuse[i] = false;
            }
        } else {
            $scope.showRefuse[id] = true;
            for (var j = 0; j < $scope.showAllow.length; j++) {
                $scope.showAllow[j] = false;
            }
        }

    };
    $scope.choiceStatus = function (status) {  //选择状态
        $scope.status = status;
        if (status == 2) {
            $scope.statusText = "下户";
        } else if (status == 3) {
            $scope.statusText = "审批中";
        } else if (status == 4) {
            $scope.statusText = "审批通过";
        } else if (status == 5) {
            $scope.statusText = "开户";
        } else if (status == 6) {
            $scope.statusText = "放款";
        } else if (status == 7) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.cancel = function (id) { //关闭窗口
        $scope.showAllow[id] = false;
        $scope.showRefuse[id] = false;
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
            } else if (d.returnCode == 1002 && d.errorString == "abd") {
                alert("这条操作已经操作过了");
                console.log(d);
            } else if (d.returnCode == 1002 && d.errorString == "la") {
                alert("申请的状态错误");
                console.log(d);
            } else {
                alert(d);
                console.log(d);
            }

        }).error(function (d) {
            // console.log(d);
        });
    };

    /*拒绝客户经理的请求*/
    $scope.refuse = function (id, index) {
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
                $scope.showRefuse[index] = false;
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