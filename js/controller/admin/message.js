var messageCtrl = angular.module('messageCtrl', []);
messageCtrl.controller('MessageBankCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {

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
                $scope.id_arr = [];
                $scope.message_list = [];
                $scope.message_list_old = d.result.datas;
                for (var i = 0; i < $scope.message_list_old.length; i++) {
                    if ($scope.id_arr.indexOf($scope.message_list_old[i].applyId) == -1) {
                        $scope.id_arr.push($scope.message_list_old[i].applyId);
                        $scope.message_list.push($scope.message_list_old[i]);
                    }
                }
                console.log($scope.id_arr);
                console.log($scope.message_list);
                angular.forEach($scope.message_list, function (data) {
                    data.dayNum = '';
                    if (data.status == 1) {
                        data.progressText = "准备中";
                        data.jindu_success = 15;
                    } else if (data.status == 2) {
                        data.progressPro = "准备中";
                        data.progressText = "下户";
                        data.jindu = 15;
                        data.jindu_next = 10;
                        data.jindu_success = 25;
                    } else if (data.status == 3) {
                        data.progressPro = "下户";
                        data.progressText = "审批中";
                        data.jindu = 25;
                        data.jindu_next = 15;
                        data.jindu_success = 40;
                    } else if (data.status == 4) {
                        data.progressPro = "审批中";
                        data.progressText = "审批通过";
                        data.jindu = 40;
                        data.jindu_next = 15;
                        data.jindu_success = 55;
                    } else if (data.status == 5) {
                        data.progressPro = "审批通过";
                        data.progressText = "开户";
                        data.jindu = 55;
                        data.jindu_next = 15;
                        data.jindu_success = 70;
                    } else if (data.status == 6) {
                        data.progressPro = "开户";
                        data.progressText = "放款";
                        data.jindu = 70;
                        data.jindu_next = 15;
                        data.jindu_success = 85;
                    } else if (data.status == 7) {
                        data.progressText = "成功融资";
                        data.jindu = 100;
                        data.jindu_success = 100;
                    } else if (data.status == -1) {
                        data.progressText = "申请取消";
                    }
                });
            }).error(function (d) {
            });
        };
        $scope.bank_list(1, 100);
        $scope.statusPro = "";
        /*显示窗口*/
        $scope.showAllow = []; //初始化参数
        $scope.showRefuse = []; //初始化参数
        $scope.show_allow = function (status, id, type) { //显示窗口函数
            $scope.showAllow = [];
            if (type == 0) {
                $scope.showAllow[id] = true;
                $scope.status = status;
                if (status == 2) {
                    $scope.statusPro = "准备中";
                    $scope.statusText = "下户";
                } else if (status == 3) {
                    $scope.statusPro = "下户";
                    $scope.statusText = "审批中";
                } else if (status == 4) {
                    $scope.statusPro = "审批中";
                    $scope.statusText = "审批通过";
                } else if (status == 5) {
                    $scope.statusPro = "审批通过";
                    $scope.statusText = "开户";
                } else if (status == 6) {
                    $scope.statusPro = "审批通过";
                    $scope.statusText = "放款";
                } else if (status == 7) {
                    $scope.statusPro = "放款";
                    $scope.statusText = "成功融资";
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

        /*关闭弹出框*/
        $scope.closeAlert = function (name, $event) {
            $scope.change_alert = false;
            if ($scope.stopPropagation) {
                $event.stopPropagation();
            }
        };
        $scope.cancel_alert = function () {
            $scope.change_alert = false;

        };
        $scope.change_alert = false;
        $scope.stop_alert = function (id) {
            $scope.stop_alert_id = id;
            $scope.change_alert = true;
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
                    $scope.bank_list(1, 100);
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
        /*修改进度*/
        $scope.change_status = function (dayNum, id, index) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "status": $scope.status,
                "days": dayNum,
                "id": id,
            };
            console.log(m_params);
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/modifyRate",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        console.log(data);
                        $rootScope.successMsg = "已经修改进度";
                        $rootScope.fadeInOut("#alert", 500);
                        $scope.showAllow[index] = false;
                        $scope.bank_list(1, 100);
                        // $scope.$apply();
                    } else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        };
        /*拒绝客户经理的请求*/
        $scope.refuse = function (id, index) {
            $scope.reason_refuse = $("#reason_refuse").val();
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "id": id,
                "reason": $scope.reason_refuse,
            };
            $http({
                url: api_uri + "applyBankDeal/manage/refuse",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $rootScope.successMsg = "驳回已发送";
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.showRefuse[index] = false;
                    $scope.bank_list(1, 100);
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

        /*中止项目*/
        $scope.continue = function (id) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "id": id,
            };
            console.log(m_params);
            $.ajax({
                type: 'POST',
                url: api_uri + "applyBankDeal/manage/follow",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        console.log(data);
                        $rootScope.successMsg = "继续项目";
                        $rootScope.fadeInOut("#alert", 500);
                        $scope.bank_list(1, 100);
                    } else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        };

        $scope.stopped = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "id": $scope.stop_alert_id,
            };
            console.log(m_params);
            $.ajax({
                type: 'POST',
                url: api_uri + "applyBankDeal/manage/stopped",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        console.log(data);
                        $rootScope.successMsg = "已经中止项目";
                        $rootScope.fadeInOut("#alert", 500);
                        $scope.bank_list(1, 100);
                    } else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        };

        $scope.change_to_bank = function (id) {
            $state.go('admin.my_project.change_bank', {
                'id': id,
                'page': 1,
                'scroll': 0
                }
            )
        }

        $scope.stopped_person = function (dayNum, id, index) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "id": id,
            };
            console.log(m_params);
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/stopped",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        console.log(data);
                        $rootScope.successMsg = "继续项目";
                        $rootScope.fadeInOut("#alert", 500);
                        $scope.bank_list(1, 100);
                    } else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        };
    }]);

messageCtrl.controller('MessageSystemCtrl',
    ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {
        $scope.list = function (pageNo, pageSize) {
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
                console.log(d);
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
            }).error(function (d) {
                // console.log(d);
            });
        };
        $scope.list(1, 100);

        $scope.list_stop = function (pageNo, pageSize) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "pageNo": pageNo,
                "pageSize": pageSize,
            };
            $http({
                url: api_uri + "zrh/message/listApplyManageDeal",
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                $scope.stop_list = d.result.datas;
            }).error(function (d) {
                // console.log(d);
            });
        };
        $scope.list_stop(1, 100);
        $scope.changePage = function (page) {
            $scope.pageNo1 = page;
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
                console.log(d);

            }).error(function (d) {
            });
        };
    }]);