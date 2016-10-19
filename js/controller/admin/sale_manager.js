var saleManagerCtrl = angular.module('saleManagerCtrl', []);

saleManagerCtrl.controller('SaleManagerCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {

    $scope.list_show = true;
    /*获取团队成员列表*/
    $scope.list = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "zrh/group/listOtherFromGroup",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $scope.user_list = d.result;
                angular.forEach($scope.user_list, function (data) {
                    if (data.role == "admin") {
                        data.position = "销售人员";
                    } else if (data.role == "manager") {
                        data.position = "销售主管";
                    } else if (data.role == "super") {
                        data.position = "超级管理员";
                    }
                });
            } else if (d.returnCode == 1003) {
                alert("该用户没有分组");
            }
            else {
                console.log(d);
            }

        }).error(function (d) {
        })
    };
    $scope.list();

    $scope.list_company = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "wd": $scope.wd,
        };
        $http({
            url: api_uri + "zrh/group/listApplyInGroup",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.company_list = d.result.datas;
                console.log($scope.company_list);
            } else if (d.returnCode == 1003) {
                alert("该用户没有分组");
            }
            else {
                console.log(d);
            }

        }).error(function (d) {
        })
    };
    /*搜索*/

    $scope.$watch('search_text', function (newValue, oldValue) {
        if (newValue) {
        } else {
            $scope.list_show = true;
        }
    });

    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list_show = false;
        $scope.list_company();
    };
    $scope.cancel = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/removeSaleFromGroup",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.ids = [];
                    $scope.list();
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.showDetail = function (id) {
        $state.go('admin.user_list.sale_apply_list', ({'id': id}))
    };
    }]);

saleManagerCtrl.controller('SaleApplyListCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$location', '$stateParams', function ($http, $scope, $state, $rootScope, $location, $stateParams) {

    /*获取团队人员申请列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "uid": $stateParams.id,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "status": $scope.status
        };
        $http({
            url: api_uri + "applyDeal/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result.list;
                $scope.result_list = d.result.list.datas;
                $scope.count = d.result.count;
                $scope.userName = d.result.userName;
                angular.forEach($scope.result_list, function (data) {
                    if (data.lastCommentTime) {
                        data.currentTime = new Date().getTime();
                        data.timeOver = (data.currentTime - data.lastCommentTime) / 1000 / 3600 / 24;
                    }
                    $scope.status = d.result.status;
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

    $scope.status_text = "全部";
    $scope.choice = function (status) {
        $scope.status = status;
        if ($scope.status == 0) {
            $scope.status_text = "未申请";
        } else if ($scope.status == 1) {
            $scope.status_text = "申请中";
        } else if ($scope.status == 2) {
            $scope.status_text = "约见中";
        } else if ($scope.status == 3) {
            $scope.status_text = "跟进中";
        } else if ($scope.status == 4) {
            $scope.status_text = "成功融资";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.updateApply = function (id) {
        $state.go('admin.my_project.detail', {id: id});
    };
    $scope.go_sale_manage = function () {
        $state.go('admin.user_list')
    };
    }]);