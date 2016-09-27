/**
 * Created by baiyang on 2016/7/7.
 */
var loanApplicationCtrl = angular.module('loanApplicationCtrl', []);
loanApplicationCtrl.controller('LoanApplicationCtrl', function ($http, $scope, $rootScope, $location) {

    /*获取申请列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            "status": $scope.status
        };
        // console.log(m_params);
        $http({
            url: api_uri + "loanApplicationManage/pool",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
                angular.forEach($scope.result_list, function (data) {
                    $scope.status = d.result.status;
                    if (data.status == 0) {
                        data.progressText = "未申请";
                        data.color = 1;
                    } else {
                        data.progressText = "已申请";
                        data.color = 2;
                    }
                });
            }
            else {
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };
    $scope.list(1, 20);
    $scope.changePage = function(page){
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

    /*删除申请*/
    $scope.delete = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        //console.log($scope.ids);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                    //$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    /*搜索*/
    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    /*筛选状态*/
    $scope.status_text = "全部";
    $scope.choice = function (status) {
        $scope.status = status;
        if ($scope.status == 0) {
            $scope.status_text = "未申请";
        } else if ($scope.status == 1) {
            $scope.status_text = "已申请";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };

    /*跳转页面*/
    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };
});

loanApplicationCtrl.controller('AddCompanyCtrl', function ($http, $scope, $rootScope, $state, $location, $timeout, $routeParams) {
    /*保存基本信息*/
    $scope.submitMessage = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "company_name": $scope.basic.company_name,
            "legal_representative": $scope.basic.legal_representative,
            "register_date": $scope.basic.register_date,
            "registered_capital": $scope.basic.registered_capital,
            "officeAddress": $scope.basic.officeAddress,
            "business_address": $scope.basic.business_address,
            "item_category": $scope.basic.item_category,
            "business_type": $scope.basic.business_type,
            "business_scope": $scope.basic.business_scope,
            "linkmanName": $scope.basic.linkmanName,
            "linkmanMobile": $scope.basic.linkmanMobile,
            "continual": $scope.basic.continual,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $state.go("admin.company_message");
                    $scope.$apply();
                }
                else {
                    //console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});
