var channelCtrl = angular.module('channelCtrl', []);

channelCtrl.controller('ChannelCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {

    /*渠道人列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "wxShare/manager/customerList",
            method: "GET",
            params: m_params
        }).success(function (d) {

            if (d.returnCode == 0) {
                $scope.page = d.result;
                if (d.result != undefined) {
                    $scope.user_list = d.result.datas;
                }

            }
            else {
                console.log(d);
            }

        }).error(function (d) {
        })
    };
    $scope.list(1, 20);

    /*分页*/
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    /*复选框选择*/
    $scope.selected = [];
    $scope.ids = [];
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };
    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            // console.log($scope.ids);
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

    /*搜索*/
    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    /*删除渠道人*/
    $scope.cancel = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/cancelCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.ids = [];
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    /*跳转到渠道人任务列表*/
    $scope.showDetail = function (id) {
        $state.go('admin.channel.detail', ({'id': id}));
    };
    /*添加渠道人员*/
    $scope.add_channel_man = function () {
        $state.go('admin.channel.create');
    };
    }]);

channelCtrl.controller('CreateCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {

    /*添加渠道人员*/
    $scope.submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.username,
            "mobile": $scope.phone,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/addCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $state.go("admin.channel");
                    $rootScope.successMsg = "添加成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.$apply();
                } else if (data.returnCode == 1002) {
                    alert("该用户已经有上级，或者是最高级别用户，不可以添加");
                } else if (data.returnCode == 1003) {
                    alert("此手机号尚未注册，暂不能使用");
                } else if (data.returnCode == 1004) {
                    alert("该用户已经被分配");
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
    }]);

channelCtrl.controller('ChannelDetailCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$stateParams', function ($http, $scope, $state, $rootScope, $stateParams) {

    /*渠道人员任务列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            "status": $scope.status,
            "uid": $stateParams.id
        };
        $http({
            url: api_uri + "wxShare/manager/customerApplyList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d)
                $scope.name = d.result.name;
                $scope.page = d.result.pagination;
                $scope.result_list = d.result.pagination.datas;
                angular.forEach($scope.result_list, function (data) { //申请状态显示
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
                });
            }
            else {
                console.log(d);
            }
        }).error(function (d) {

        })
    };
    $scope.list(1, 20);

    /*分页显示*/
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    /*复选框*/
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

    /*搜索*/
    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };
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

    /*跳转到其他页面*/
    $scope.addApply = function () {
        $state.go('admin.channel.add_apply', ({'id': $stateParams.id}));
    };
    $scope.history = function () {
        $state.go('admin.channel.history', ({'id': $stateParams.id}));
    };
    $scope.go_back_channel = function () {
        $state.go('admin.channel');
    };

    $scope.updateApply = function (id) {
        $state.go('admin.my_project.detail', ({'id': id}));
    };
    }]);

channelCtrl.controller('AddApplyCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$location', '$stateParams', function ($http, $scope, $state, $rootScope, $location, $stateParams) {

    /*获取申请详情*/
    $scope.getApply = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "companyName": $scope.companyName
        };
        $http({
            url: api_uri + "loanApplicationManage/listByCompanyName",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
        })
    };

    /*选择该公司产品*/
    $scope.choice_product = function (id, name) {
        $scope.productId = id;
        $scope.productName = name;
    };

    /*提交绑定请求*/
    $scope.submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $scope.productId,
            "uid": $stateParams.id
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/addChannel",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.back();
                    $rootScope.successMsg = "绑定成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.$apply();
                } else if (data.returnCode == 1003) {
                    alert("用户不存在或申请不存在");
                } else if (data.returnCode == 1004) {
                    alert("参数错误");
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    /*返回到详情页面*/
    $scope.back = function () {
        $state.go('admin.channel.detail', ({'id': $stateParams.id}));
    };
    }]);

channelCtrl.controller('HistoryCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$stateParams', function ($http, $scope, $state, $rootScope, $stateParams) {

    /*成为渠道之前的申请列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "uid": $stateParams.id
        };
        $http({
            url: api_uri + "/loanApplicationManage/historyList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
                angular.forEach($scope.result_list, function (data) {
                    $scope.status = d.result.status;
                    if (data.status == 0) {
                        data.progressText = "未申请";
                    } else if (data.status == 1) {
                        data.progressText = "申请中";
                        data.progressBtn = "开始约见";
                    } else if (data.status == 2) {
                        data.progressText = "约见中";
                        data.progressBtn = "继续跟进";
                    } else if (data.status == 3) {
                        data.progressText = "跟进中";
                        data.progressBtn = "完成贷款";
                    } else if (data.status == 4) {
                        data.progressText = "成功融资";
                        data.progressBtn = "已结束";
                    } else if (data.status == -1) {
                        data.progressText = "申请取消";
                    }
                });
            }
            else {
            }

        }).error(function (d) {
            // $location.path("/error");
        })
    };
    $scope.list(1, 20);

    /*分页显示*/
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    /*是否选中*/
    $scope.ids = [];
    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    /*跳转页面*/
    $scope.goBackDetail = function () {
        $state.go('admin.channel.detail', ({'id': $stateParams.id}));
    };
    $scope.change_register = function (id) {
        $state.go('admin.channel.change', ({'id': $stateParams.id, 'idt': id}));
    };

    }]);

channelCtrl.controller('ChangeCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$stateParams', function ($http, $scope, $state, $rootScope, $stateParams) {

    /*变更企业*/
    $scope.change = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.idt,
            "mobile": $scope.phone,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "/loanApplicationManage/changeMobile",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.back_channel();
                    $rootScope.successMsg = "变更成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.$apply();
                } else if (data.returnCode == 1002) {
                    alert("该申请已经处理过了")
                } else if (data.returnCode == 1003) {
                    alert("申请不存在")
                } else {
                    alert("未知错误");
                }
            },
            dataType: 'json',
        });
    };
    $scope.back_channel = function () {
        $state.go('admin.channel.history', ({'id': $stateParams.id}));
    };
    }]);
