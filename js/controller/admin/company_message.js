/**
 * Created by baiyang on 2016/7/7.
 */
var loanApplicationCtrl = angular.module('loanApplicationCtrl', []);
loanApplicationCtrl.controller('LoanApplicationCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$location', '$stateParams', function ($http, $scope, $state, $rootScope, $location, $stateParams) {

        /*获取申请列表*/
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
                url: api_uri + "loanApplicationManage/pool",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    console.log(d);
                    $scope.page = d.result;
                    $scope.result_list = d.result.datas;
                    angular.forEach($scope.result_list, function (data) {
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
                    console.log(d);
                }
            }).error(function (d) {
                $location.path("/error");
            })
        };
        $scope.list($stateParams.page, 20);
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
            var scroll = $('.line-roll').scrollTop();
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                ids: $scope.ids
            };
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/delete",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        $('.line-roll').scrollTop(scroll);
                        $scope.list($scope.pageNo1, 20);
                    }
                    else {
                    }
                },
                dataType: 'json',
            });
        };

        /*搜索*/
        $scope.search = function () {
            $scope.wd = $scope.search_text;
            $scope.list(1, 20);
        };

        /*筛选状态*/
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

    }]);

loanApplicationCtrl.controller('AddCompanyCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {

        /*获取银行列表*/
        $scope.list = function (pageNo, pageSize) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "pageNo": pageNo,
                "pageSize": pageSize,
            };
            $http({
                url: api_uri + "manage/bank/list",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.page = d.result;
                    $scope.bank_list = d.result.datas;
                }
                else {
                }

            }).error(function (d) {
                $location.path("/error");
            })
        };
        $scope.list(1, 100);

        /*选择产品*/
        $scope.choiceProduct = function (id, name) {
            $scope.productId = id;
            $scope.productName = name;
        };
        $scope.choice_product_type = function (type) {
            $scope.productType = type
        };
        /*选择银行*/
        $scope.choiceBank = function (id, name) {
            $scope.bankId = id;
            $scope.bankName = name;
            $scope.product_list_get($scope.bankId, 1, 400);
            $scope.productName = "";
        };
        /*获取产品列表*/
        $scope.product_list_get = function (id, pageNo, pageSize) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "bankId": id,
                "pageNo": pageNo,
                "pageSize": pageSize,
                "productType": $scope.productType,
                "release": true
            };
            $http({
                url: api_uri + "financialProductManage/list",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.page = d.result;
                    $scope.product_list = d.result.datas;
                }
                else {
                }

            }).error(function (d) {
            })
        };
        /*保存基本信息*/
        $scope.submitMessage = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "companyName": $scope.companyName,
                "linkman": $scope.linkman,
                "mobile": $scope.applyMobile,
                "applyMobile": $scope.applyMobile,
                "productType": $scope.productType,
                "productId": $scope.productId
            };
            console.log(m_params)
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/apply",
                // url: api_uri + "inforTemplate/create",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        console.log(data);
                        $state.go("admin.my_project.working");
                        $scope.$apply();
                    } else if (data.returnCode == 1001) {
                        alert("该公司信息已经存在");
                    }
                    else {
                        console.log(data);
                    }
                },
                dataType: 'json'
            });
        };
    }]);
