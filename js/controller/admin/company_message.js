/**
 * Created by baiyang on 2016/7/7.
 */
var loanApplicationCtrl = angular.module('loanApplicationCtrl', []);
loanApplicationCtrl.controller('LoanApplicationCtrl', function ($http, $state, $scope, $stateParams, $rootScope, $location) {
    $scope.page_init = 1;
    var container = $('.line-roll');
    if ($stateParams.page) {
        $scope.page = $stateParams.page;
    } else {
        $scope.page = 1;
    }
    if ($stateParams.wd) {
        $scope.wd = $stateParams.wd;
        $scope.search_text = $stateParams.wd
    } else {
        $scope.wd = '';
        $scope.search_text = ''
    }
    if ($stateParams.status) {
        $scope.status = $stateParams.status;
    } else {
        $scope.status = "";
        $scope.status_text = "全部";
    }
    /*获取申请列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $stateParams.wd,
            "status": $stateParams.status
        };
        $http({
            url: api_uri + "loanApplicationManage/pool",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
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
                container.animate({scrollTop: $stateParams.scroll * 100}, 50);
            }
            else {
                console.log(d);
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };
    $scope.list($stateParams.page, 20);
    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.scroll = 0;
            $state.go('admin.company_message', {
                'page': $scope.pageNo1,
                'wd': $scope.wd,
                'status': $scope.status,
                'scroll': $scope.scroll
            });
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
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    $state.go('admin.company_message', {
                        'page': $scope.pageNo1,
                        'wd': $scope.wd,
                        'status': $scope.status
                    });
                    //$apply();
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
        $scope.scroll = 0;
        $state.go('admin.company_message', {
            'page': $scope.page_init,
            'wd': $scope.wd,
            'status': $scope.status,
            'scroll': $scope.scroll
        });
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
        $scope.scroll = 0;
        $state.go('admin.company_message', {
            'page': $scope.page_init,
            'wd': $scope.wd,
            'status': $scope.status,
            'scroll': $scope.scroll
        });
    };

    /*跳转页面*/
    $scope.updateApply = function (id, index) {
        console.log(index);
        // $scope.scroll = container.scrollTop();
        $state.go('admin.company_message.detail', {'id': id, 'scroll': index});
    };
});

loanApplicationCtrl.controller('DetailsCtrl', function ($http, $scope, $rootScope, $location, $state, page, $timeout, $stateParams) {
    $scope.id = $stateParams.id;  //获取路由参数
    var arrayParams = $location.$$url.split("/");
    $scope.show_btn = arrayParams[2];

    /*获取申请详情*/
    $scope.get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "inforTemplate/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.isAllot = d.result.isAllot;
            $scope.days = d.result.days;
            $scope.w = d.result.w;
            $scope.registerLinkmanName = d.result.registerLinkmanName;
            $scope.registerLinkmanMobile = d.result.registerLinkmanMobile;
            $scope.bankId = d.result.bankId;
            $scope.bankName = d.result.bankName;
            $scope.productName = d.result.productName;
            $scope.dealRemark = d.result.dealRemark;
            $scope.readonly = d.result.readonly;
            $scope.type = d.result.type;
            if (d.result.remark) {
                $scope.remark = d.result.remark;
            }
            $scope.applyTime = d.result.applyTime;
            $scope.basic = d.result.baseInfo;
            $scope.model_list = d.result.templateList;
            $scope.status = d.result.status;
            if ($scope.status == 0) {
                $scope.progressText = "未申请";
                $scope.jindu = 0;
            } else if ($scope.status == 1) {
                $scope.progressText = "准备中";
                $scope.progressBtn = "下户";
                $scope.jindu = 10;
            } else if ($scope.status == 2) {
                $scope.progressText = "下户";
                $scope.progressBtn = "审批中";
                $scope.jindu = 20;
            } else if ($scope.status == 3) {
                $scope.progressText = "审批中";
                $scope.progressBtn = "审批通过";
                $scope.jindu = 35;
            } else if ($scope.status == 4) {
                $scope.progressText = "审批通过";
                $scope.progressBtn = "开户";
                $scope.jindu = 55;
            } else if ($scope.status == 5) {
                $scope.progressText = "开户";
                $scope.progressBtn = "放款";
                $scope.jindu = 70;
            } else if ($scope.status == 6) {
                $scope.progressText = "放款";
                $scope.progressBtn = "完成融资";
                $scope.jindu = 85;
            } else if ($scope.status == 7) {
                $scope.progressText = "完成融资";
                $scope.jindu = 100;
            } else if ($scope.status == -1) {
                $scope.progressText = "完成融资";
            }
        }).error(function (d) {
            console.log(d);
        })
    };
    $scope.get();

    /*获取公司留言板列表*/
    $scope.get_message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
        };
        $http({
            url: api_uri + "apply/comments/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            $scope.message_list = d.result;
        }).error(function (d) {
            console.log(d);
        })
    };
    $scope.get_message();
    /*跳转页面*/
    $scope.messages = function (id) {
        $state.go('admin.company_message.message', {'id': id});
    };   //留言板
    $scope.reBackFromDetails = function () {
        $state.go('admin.company_message');
    }; //返回上一级页面

    /*我要处理*/
    $scope.apply = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": id,
        };
        $http({
            url: api_uri + "applyDeal/apply",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $rootScope.putSessionObject('from_route', 'admin.my_project');
                $scope.reBackFromDetails();
                // $state.go('admin.my_project.detail', {
                //     'page': 1,
                //     'wd': '',
                //     'status': '',
                //     'scroll': 0,
                //     id: $stateParams.id
                // });
                $rootScope.successMsg = "成功领取项目";
                $rootScope.fadeInOut("#alert", 500);
            } else if (d.returnCode == 1002) {
                alert("申请状态错误");
            } else if (d.returnCode == 1003) {
                alert("用户不存在");
            } else if (d.returnCode == 1000) {
                alert("服务器异常");
            } else {
                alert("其他未知错误");
            }
        }).error(function (d) {
        })
    };

    /*发布评论*/
    $scope.remark_submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "content": $scope.content,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "apply/comments/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.content = '';
                    $scope.get_message();
                    $rootScope.successMsg = "发布成功";
                    $rootScope.fadeInOut("#alert", 500);
                } else if (d.returnCode == 1003) {
                    alert("申请不存在，发布失败");
                } else if (d.returnCode == 1000) {
                    alert("服务器错误");
                } else {
                    alert("其他未知错误");
                }
            },
            dataType: 'json',
        });

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
        console.log(m_params);
        if (m_params.company_name) {
            $.ajax({
                type: 'POST',
                url: api_uri + "inforTemplate/create",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        $state.go("admin.company_message");
                        $scope.$apply();
                    } else if (data.returnCode == 1001) {
                        alert("该公司信息已经存在");
                    }
                    else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        } else {
            alert("公司名称必填")
        }

    };
});

myProjectCtrl.controller('MessagesCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location) {

    /*获取留言列表*/
    $scope.get_message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "apply/comments/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.message_list = d.result;
        }).error(function (d) {

        })
    };
    $scope.get_message();

    /*返回详情页面*/
    $scope.backProjectDetail = function () {
        $state.go('admin.company_message.detail', {'id': $stateParams.id});
    };
});