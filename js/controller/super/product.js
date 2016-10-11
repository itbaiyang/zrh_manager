/**
 * Created by baiyang on 2016/7/7.
 */
var productCtrl = angular.module('productCtrl', []);
productCtrl.controller('ProductCtrl', function ($http, $scope, $rootScope, $location, $timeout) {

    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            "release": $scope.release_status
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
                angular.forEach($scope.result_list, function (data) {
                    if (!data.release) {
                        data.progressText = "未发布";

                    } else {
                        data.progressText = "已发布";
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
    $scope.ids=[];
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

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/release",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.cancel = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/unRelease",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.delete = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };
    $scope.sort_up = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/up",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.update = function(id){
        //$location.state('master.product.update');
        $location.path('/super/product/update/' + id);
    };

    $scope.release = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/release",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    $scope.unrelease = function (id) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/unRelease",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.release_text = "全部";
    $scope.choice = function (release) {
        $scope.release_status = release;
        if ($scope.release_status == true) {
            $scope.release_text = "已发布";
        } else if ($scope.release_status == false) {
            $scope.release_text = "未发布";
        } else if ($scope.release_status == null) {
            $scope.release_text = "全部";
        }
        $scope.list(1, 20);
    };

});

productCtrl.controller('ProductCreateCtrl', function ($http, $scope, $rootScope,$state, $location, $timeout, $routeParams) {
    $scope.feature_list = [{"feature":""}];
    $scope.add_feature = function () {
        $scope.feature_list.push({
            "feature":""
        });
    };

    $scope.remove_feature = function (feature) {
        for (var key in $scope.feature_list) {
            if ($scope.feature_list[key] == feature) {
                $scope.feature_list.splice(key, 1);
                break;
            }
        }
    };

    $scope.condition_list = [{"condition":""}];

    $scope.add_condition = function () {
        $scope.condition_list.push({
            "condition":""
        });
    };

    $scope.remove_condition = function (condition) {
        for (var key in $scope.condition_list) {
            if ($scope.condition_list[key] == condition) {
                $scope.condition_list.splice(key, 1);
                break;
            }
        }
    };

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

    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
    };

    $scope.tags = "";

    if (!$scope.type) {
        $scope.type = 0;
    }
    $scope.submit = function () {
        var tags = [];
        var text = $scope.tags;
        var reg = new RegExp('＃', 'g');
        text = text.replace(reg, '#');
        var array = text.split("#");
        for (var i = 0; i < array.length; i++) {
            if (array[i] != "" && array[i] != " ") {
                tags.push(array[i]);
            }
        }
        $scope.feature_list_new = [];
        $scope.condition_list_new = [];
        for (var key in $scope.feature_list) {
            $scope.feature_list_new.push($scope.feature_list[key].feature);
        }
        for (var key in $scope.condition_list) {
            $scope.condition_list_new.push($scope.condition_list[key].condition);
        }
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            "name": $scope.product.name,
            "tags": tags,
            "bankId": $scope.bankId,
            "rate": $scope.product.rate,
            "rateRemark": $scope.product.rateRemark,
            "loanvalue": $scope.product.loanvalue,
            "loanlife": $scope.product.loanlife,
            "summary": $scope.product.summary,
            "feature": $scope.feature_list_new,
            "conditions": $scope.condition_list_new,
            "type": $scope.type
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $state.go("super.product");
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

productCtrl.controller('ProductUpdateCtrl', function ($http, $scope, $state, $rootScope, $location, $stateParams, $timeout, $routeParams) {
    $scope.feature_list = [];
    $scope.tags = "";
    $scope.add_feature = function () {
        $scope.feature_list.push({
            "feature":""
        });
    };
    $scope.remove_feature = function (feature) {
        for (var key in $scope.feature_list) {
            if ($scope.feature_list[key] == feature) {
                $scope.feature_list.splice(key, 1);
                break;
            }
        }
    };
    $scope.condition_list = [];
    $scope.add_condition = function () {
        $scope.condition_list.push({
            "condition":""
        });
    };
    $scope.remove_condition = function (condition) {
        for (var key in $scope.condition_list) {
            if ($scope.condition_list[key] == condition) {
                $scope.condition_list.splice(key, 1);
                break;
            }
        }
    };

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
                console.log(d.result);
            }

        }).error(function (d) {
            $location.path("/error");
        })
    };

    $scope.list(1, 100);

    $scope.get = function(){
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "financialProductManage/detail/"+$stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            $scope.pageTitle = "修改金融产品";
            $scope.product = d.result;
            $scope.type = d.result.type;
            $scope.bankName = $scope.product.bankname;
            $scope.bankId = $scope.product.bankId;
            $scope.tags_arr = $scope.product.tags;
            if ($scope.tags_arr) {
                for (var i = 0; i < $scope.tags_arr.length; i++) {
                    $scope.tags += "#";
                    $scope.tags += $scope.tags_arr[i];
                    $scope.tags += "# ";
                }
                ;
            }
            for (var key in d.result.feature) {
                $scope.feature_list.push({"feature": d.result.feature[key]});
            }
            for (var key in d.result.conditions) {
                $scope.condition_list.push({"condition": d.result.conditions[key]});
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };
    $scope.get();

    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
    };

    //var tags = [];

    $scope.submit = function () {
        var tags = [];
        var text = $scope.tags;
        var reg = new RegExp('＃', 'g');
        text = text.replace(reg, '#');
        var array = text.split("#");
        for (var i = 0; i < array.length; i++) {
            if (array[i] != "" && array[i] != " ") {
                tags.push(array[i]);
            }
        }
        $scope.feature_list_new = [];
        $scope.condition_list_new = [];
        for (var key in $scope.feature_list) {
            $scope.feature_list_new.push($scope.feature_list[key].feature)
        }
        for (var key in $scope.condition_list) {
            $scope.condition_list_new.push($scope.condition_list[key].condition)
        }
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "id":$stateParams.id,
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.product.name,
            "tags": tags,
            "type": $scope.type,
            "bankId": $scope.bankId,
            "rate": $scope.product.rate,
            "rateRemark": $scope.product.rateRemark,
            "loanvalue": $scope.product.loanvalue,
            "loanlife": $scope.product.loanlife,
            "summary": $scope.product.summary,
            "feature": $scope.feature_list_new,
            "conditions": $scope.condition_list_new,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/update",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $state.go('super.product');
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