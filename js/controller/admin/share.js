var shareCtrl = angular.module('shareCtrl', []);

shareCtrl.controller('ShareCtrl', function ($http, $scope, $state, $rootScope, $location, $routeParams) {

    /*分享列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            // "wd": wd,
        };
        $http({
            url: api_uri + "wxShare/manager/userList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.user_list = d.result.datas;
            }
            else {
                // console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
    };
    $scope.list(1, 20);

    /*分页*/
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        // console.log($scope.pageNo1);
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
            // console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };
    $scope.updateSelection = function ($event, id) {
        // console.log("点击一下")
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
    $scope.remark = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/toCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                    $scope.ids = [];
                }
                else {
                    // console.log(data);
                }
            },
            dataType: 'json',
        });

    };
    $scope.showDetail = function (id) {
        $location.path('/admin/share/share_detail/' + id);
    };
});

shareCtrl.controller('ShareDetailCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "uid": $stateParams.id
        };
        // console.log(m_params);
        $http({
            url: api_uri + "wxShare/manager/applyList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
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

            }

        }).error(function (d) {

        })
    };

    $scope.list(1, 20);
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        // console.log($scope.pageNo1);
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
            // console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };
    $scope.updateSelection = function ($event, id) {
        // console.log("点击一下")
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

    /*取消*/
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

    /*跳转页面*/
    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };
    $scope.go_back_share = function () {
        $location.path('/admin/share');
    };
});