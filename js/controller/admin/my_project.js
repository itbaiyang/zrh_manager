var myProjectCtrl = angular.module('myProjectCtrl', []);
myProjectCtrl.controller('MyProjectCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {
    $scope.showCancel = false; //放弃任务取消理由框显示
    $scope.comments_give = '';  //留言板评论内容

    /* 获取我的项目列表*/
    $scope.list = function (pageNo, pageSize) { 
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            "status": $scope.status
        };
        $http({
            url: api_uri + "applyDeal/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.pages = d.result.list;              //分页
                $scope.result_list = d.result.list.datas; //列表参数
                $scope.count = d.result.count;            //列表统计
                $scope.userName = d.result.userName;
                angular.forEach($scope.result_list, function (data) {//申请状态显示
                    if (data.lastCommentTime) {
                        data.currentTime = new Date().getTime();
                        data.timeOver = (data.currentTime - data.lastCommentTime) / 1000 / 3600 / 24;
                    }
                    if (data.hasStopDeal == true) {
                        data.progressText = '申请失败';
                        data.color = 1;
                    } else {
                        if (data.status == 0) {
                            data.progressText = "未申请";
                            data.color = 1;
                        } else if (data.status == 1) {
                            data.progressText = "准备中";
                            data.color = 2;
                        } else if (data.status == 2) {
                            data.progressText = "下户";
                            data.color = 2;
                        } else if (data.status == 3) {
                            data.progressText = "审批中";
                            data.color = 2;
                        } else if (data.status == 4) {
                            data.progressText = "审批通过";
                            data.color = 2;
                        } else if (data.status == 5) {
                            data.progressText = "下户";
                            data.color = 2;
                        } else if (data.status == 6) {
                            data.progressText = "放款";
                            data.color = 2;
                        } else if (data.status == 7) {
                            data.progressText = "成功融资";
                            data.color = 3;
                        } else if (data.status == -1) {
                            data.progressText = "申请取消";
                            data.color = 1;
                        }
                    }
                });
            }
            else {
                console.log(d);
            }
        }).error(function (d) {
            console.log(d);
        })
    };
    $scope.list(1, 20);

    $scope.changePage = function (page) {  //列表分页函数
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    /*选中申请相关,目前只做放弃项目*/
    $scope.selected = [];
    $scope.ids = [];
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };
    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    /*搜索,筛选*/
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };
    $scope.status_text = "全部";
    $scope.choice = function (status) {
        $scope.status = status;
        if ($scope.status == 0) {
            $scope.status_text = "未申请";
        } else if ($scope.status == 1) {
            $scope.status_text = "准备中";
        } else if ($scope.status == 2) {
            $scope.status_text = "下户";
        } else if ($scope.status == 3) {
            $scope.status_text = "审批中";
        } else if ($scope.status == 4) {
            $scope.status_text = "审批通过";
        } else if ($scope.status == 5) {
            $scope.status_text = "开户";
        } else if ($scope.status == 6) {
            $scope.status_text = "放款";
        } else if ($scope.status == 7) {
            $scope.status_text = "成功融资";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };

    /*放弃任务相关函数*/
    $scope.show_cancel = function () {
        $scope.showCancel = true;
    };
    $scope.hide_cancel = function () {
        $scope.showCancel = false;
    };
    $scope.giveUp = function () {
        var scroll = $('.line-roll').scrollTop();
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "ids": $scope.ids,
            "c": $scope.comments_give
        };
        console.log(m_params);
        if (m_params.ids.length == 0) {
            alert("没有选择项目");
        } else if (m_params.c == '') {
            alert("必须填写放弃原因");
        } else {
            $.ajax({
                type: 'GET',
                url: api_uri + "loanApplicationManage/giveUp",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        // console.log(data);
                        $scope.ids = [];
                        $('.line-roll').scrollTop(scroll);
                        $scope.list($scope.pageNo1, 20);
                        $scope.hide_cancel();
                        $scope.code_list = data.result;
                        if ($scope.code_list) {
                            for (var i = 0; i < $scope.code_list.length; i++) {
                                if ($scope.code_list[i].code == 10002) {
                                    alert($scope.code_list[i].name + "，你已经选择了销售职员，所以不可以放弃项目，如果要放弃，请选择自己为销售职员");
                                } else if ($scope.code_list[i].code == 10001) {
                                    alert("申请不存在,请刷新页面");
                                } else {
                                    $rootScope.successMsg = "操作成功";
                                    $rootScope.fadeInOut("#alert", 500);
                                }
                            }
                        }
                    }
                },
                dataType: 'json',
            });
        }
    };
    }]);
