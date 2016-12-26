var applyListCtrl = angular.module('applyListCtrl', []);
applyListCtrl.controller('ApplyListCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

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
            url: api_uri + "loanApplicationManage/list",
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
                        data.progressText = "开户";
                        data.color = 2;
                    } else if (data.status == 6) {
                        data.progressText = "放款";
                        data.color = 2;
                    } else if (data.status == 7) {
                        data.progressText = "完成融资";
                        data.color = 3;
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
            //console.log("添加id"+$scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
            //console.log("删除id"+id);
        }
    };

    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.delete = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        //console.log($scope.ids);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/deleteAll",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // //console.log(data);
                if (data.returnCode == 0) {
                    //console.log(data);
                    $scope.list($scope.pageNo1, 10);
                    //$apply();
                }
                else {
                    //console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    $scope.search_text = null;
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
            $scope.status_text = "申请中";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };

    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };
}]);