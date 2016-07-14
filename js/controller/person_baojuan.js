/**
 * Created by baiyang on 2016/7/7.
 */
/**
 * Created by baiyang on 2016/7/7.
 */
var personBjCtrl = angular.module('personBjCtrl', []);
personBjCtrl.controller('PersonBjCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    var result_list = [];

    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        console.log(m_params);
        $http({
            url: api_uri + "applyDeal/list",
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
                    } else if (data.status == 1) {
                        data.progressText = "审核中";
                    } else if (data.status == 2) {
                        data.progressText = "约见中";
                    } else if (data.status == 3) {
                        data.progressText = "跟进中";
                    } else if (data.status == 4) {
                        data.progressText = "成功融资";
                        data.progressBtn = "已结束";
                    } else if (data.status == -1) {
                        data.progressText = "申请取消";
                    }
                });
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        })
    };
    $scope.nextStatus = function (id,status) {
        var login_user = $rootScope.getObject("login_user");
        if(status <4){
            status++;
            var m_params = {
                "userId":login_user.userId,
                "token":login_user.token,
                status:status
            };
            //console.log(m_params);
            $http({
                url: api_uri + "loanApplicationManage/next/"+id,
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                }

            }).error(function (d) {
                console.log("login error");
                $location.path("/error");
            })
        }else{
            console.log("已经融资成功无法执行下一步")
        }

    };

    $scope.list(1, 20);
    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
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
            console.log("添加id"+$scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
            console.log("删除id"+id);
        }
    };
    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.editApply = function (id) {
        $location.path('/master/person_baojuan/edit_apply/' + id);
        console.log(id);
    };

    $scope.delete = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            ids: $scope.ids,
            "userId": login_user.userId,
            "token": login_user.token,
        };
        console.log($scope.ids);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    $scope.cancel = function (id) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            "applyId":id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "applyDeal/cancel",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
            }
            else {
            }

        }).error(function (d) {
        })
    };
});

personBjCtrl.controller('AddCompanyCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    /*添加删除模板*/
    $scope.model_list = [];
    var id_model = 0;
    $scope.addModel = function (model) {
        $scope.model_list.push({
            "id": id_model,
            "model": model
        });
        id_model++;
        console.log($scope.model_list);
    };
    $scope.delete = function (id) {
        for (var i = 0; i < $scope.model_list.length; i++) {
            if ($scope.model_list[i].id == id) {
                $scope.model_list.splice(i, 1);
                console.log("删除id" + id);
            }
        }
        console.log($scope.model_list);
    };

    /*保存基本信息*/
    $scope.submit = function () {
        var login_user = $rootScope.getObject("login_user");

        var m_params = {
            "applyId": "",
            "userId": login_user.userId,
            "token": login_user.token,
            "company_name": $scope.company_name,
            "legal_representative": $scope.legal_representative,
            "register_date": $scope.register_date,
            "registered_capital": $scope.registered_capital,
            "business_address": $scope.business_address,
            "item_category": $scope.item_category,
            "business_type": $scope.business_type,
            "business_scope": $scope.business_scope,
            "phone": $scope.phone,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveBase",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("创建成功了");
                    $location.path('/product');
                    $scope.$apply();

                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});

personBjCtrl.controller('EditApplyCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams, $routeParams) {
    /*添加删除模板*/
    console.log($stateParams.id);
    $scope.model = {
        title: "",
        content: "",
        name: "",
        imgList: []
    }
    $scope.model_list = [];
    var id_model = 0;
    $scope.addModel = function (templateType) {
        $scope.model_list.push({
            "id_model": id_model,
            "templateType": templateType,
            "title": $scope.model.title,
            "content": $scope.model.content,
            "name": "",
            "imgList": []
        });
        id_model++;
        console.log($scope.model_list);
    };
    $scope.delete = function (id) {
        for (var i = 0; i < $scope.model_list.length; i++) {
            if ($scope.model_list[i].id == id) {
                $scope.model_list.splice(i, 1);
                console.log("删除id" + id);
            }
        }
        console.log($scope.model_list);
    };

    /*保存基本信息*/
    $scope.basic = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "applyId": $stateParams.id,
            "userId": login_user.userId,
            "token": login_user.token,
            "company_name": $scope.company_name,
            "legal_representative": $scope.legal_representative,
            "register_date": $scope.register_date,
            "registered_capital": $scope.registered_capital,
            "business_address": $scope.business_address,
            "item_category": $scope.item_category,
            "business_type": $scope.business_type,
            "business_scope": $scope.business_scope,
            "phone": $scope.phone,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveBase",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("basic success");
                    $scope.id_basic = data.result;
                    $scope.other();
                    //$scope.$apply();
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    /*保存其他信息*/
    $scope.other = function () {
        console.log($scope.id_basic);
        var list = [];
        for (var i = 0; i < $scope.model_list.length; i++) {
            list.push({
                "title": $scope.model_list[i].title,
                "name": $scope.model_list[i].name,
                "templateType": $scope.model_list[i].templateType,
                "content": $scope.model_list[i].content,
                "imgList": $scope.model_list[i].imgList
            })
        }
        var login_user = $rootScope.getObject("login_user");
        var m_params1 = {
            "userId": login_user.userId,
            "token": login_user.token,
            "comId": $scope.id_basic,
            "list": list
        };
        console.log(m_params1);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveList",
            data: m_params1,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("list success");

                    //$scope.$apply();

                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.submit = function () {
        $scope.basic();
        //$state.go('master.person_baojuan');
    }
});