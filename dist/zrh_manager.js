var loginCtrl = angular.module('loginCtrl', []);
loginCtrl.controller('LoginCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams) {
    var getTimestampTemp = new Date().getTime();
    var timestamp = String(getTimestampTemp).substring(0, 10);
    var getTimestamp = parseInt(timestamp);
    $scope.loginUser = {
        "account": "",
        "password": "",
        "timestamp": getTimestamp
    };

    $scope.error_code_msg = {
        1003: "该用户不存在",
        2001: "用户名或密码错误",
        1002: "该用户异常",
        1: "服务器异常,请稍后再试"
    };

    var check_params = function (params) {
        if (params.account == "" || params.password == "") {
            return false;
        }
        return true;
    };

    $scope.login = function () {
        $scope.loginUser.signature = $rootScope.encryptByDES($scope.loginUser.password + $scope.loginUser.timestamp);
        var m_params = $scope.loginUser;
        //console.log($scope.loginUser);
        if (!check_params(m_params)) return;
        $http({
            url: api_uri + "p/user/login",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $rootScope.login_user = {
                    "userId": d.result.split("_")[0],
                    "token": d.result.split("_")[1],
                };
                $rootScope.putObject("login_user", $rootScope.login_user);
                $scope.choiceUser();
                //$location.path("/super");
            } else {
                //console.log(d);
            }

        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
    $scope.choiceUser = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/detail/" + $rootScope.login_user.userId,
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                if (d.result.role == 'super') {
                    $location.path("/super");
                } else {
                    $location.path("/admin");
                }
            } else {
                //console.log(d);
                var msg = $scope.error_code_msg[d.returnCode];
                if (!msg) {
                    msg = "登录失败";
                }
                $scope.error_msg = msg;
                //$scope.changeErrorMsg(msg);
            }

        }).error(function (d) {
            //$scope.changeErrorMsg("网络故障请稍后再试......");
            //$location.path("/login");
        })
    };
    $scope.reset = function () {
        //$location.path("/");
    };
});
;/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location) {

    $scope.go_home = function () {
        $location.path($rootScope.role);
    }
    $scope.exit = function () {
        $rootScope.removeObject("login_user");
        $location.path('/login');
    };
    $scope.message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            // url: api_uri + "zrh/index/message",
            url: api_uri + "applyBankDeal/manage/count",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $rootScope.count = d.result;
            }
            else {
            }

        }).error(function (d) {
        })
    };
    $scope.message();
});

topBarCtrl.controller('SideBarCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    $scope.message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "zrh/message/counts",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.system_message = d.result;
            }
            else {
            }

        }).error(function (d) {
        })
    };
});


topBarCtrl.controller('ContainsCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    var m_params = {
        "userId": $rootScope.login_user.userId,
        "token": $rootScope.login_user.token,
    };
    // $http({
    //     url: api_uri + "p/user/detail/" + $rootScope.login_user.userId,
    //     method: "GET",
    //     params: m_params
    // }).success(function (d) {
    //     console.log(d);
    // }).error(function (d) {
    // });
    $http({
        url: api_uri + "zrh/index/count",
        method: "GET",
        params: m_params
    }).success(function (d) {
        // console.log(d);
        $scope.count = d.result;

    }).error(function (d) {
    });

});
;var applyListCtrl = angular.module('applyListCtrl', []);
applyListCtrl.controller('ApplyListCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            // "status": $scope.status
        };
        // console.log(m_params);
        $http({
            url: api_uri + "loanApplicationManage/list",
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
                        data.progressText = "申请中";
                        data.color = 2;
                    }
                });
            }
            else {
                //console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            $location.path("/error");
        })
    };
    $scope.list(1, 20);
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        //console.log($scope.pageNo1);
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
        //console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.refresh = function () {
        $scope.list($scope.pageNo1, 10);
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
            url: api_uri + "loanApplicationManage/delete",
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
});
;/**
 * Created by baiyang on 2016/7/7.
 */
var productCtrl = angular.module('productCtrl', []);
productCtrl.controller('ProductCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    var result_list = [];
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
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
            console.log(d);
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

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.refresh = function () {
        $scope.list($scope.pageNo1, 10);
    };

    $scope.submit = function () {
        // var login_user = $rootScope.getObject("login_user");
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

    $scope.cancel = function () {
        // var login_user = $rootScope.getObject("login_user");
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

    $scope.update = function (id) {
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

productCtrl.controller('ProductCreateCtrl', function ($http, $scope, $rootScope, $state, $location, $timeout, $routeParams) {
    $scope.feature_list = [{"feature": ""}];
    $scope.add_feature = function () {
        $scope.feature_list.push({
            "feature": ""
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

    $scope.condition_list = [{"condition": ""}];

    $scope.add_condition = function () {
        $scope.condition_list.push({
            "condition": ""
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
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
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
            "feature": ""
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
            "condition": ""
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

    $scope.get = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "financialProductManage/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
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
            "id": $stateParams.id,
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
;var manageCtrl = angular.module('manageCtrl', []);
manageCtrl.controller('UserListCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "p/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
            //console.log("login error");
            //$location.path("/error");
        })
    };
    $scope.list(1, 20);
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 8);
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

    $scope.update = function (id) {
        $location.path("/super/manage/update/" + id);
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
            url: api_uri + "p/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };
});

manageCtrl.controller('CreateUserCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams) {
    var timesTamp = new Date().getTime();
    var timesTamp1 = String(timesTamp).substring(0, 10);
    $scope.timestamp = parseInt(timesTamp1);
    $scope.isUpdate = false;
    $scope.list = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/listManager",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.manager_list = d.result;
            }
            else {
            }

        }).error(function (d) {
            //console.log("login error");
            //$location.path("/error");
        })
    };
    $scope.choice = function (role_sale) {
        if (role_sale == 'admin') {
            $scope.role_sale_see = "销售职员";
            $scope.list(1, 20);
        } else if (role_sale == 'manager') {
            $scope.role_sale_see = "销售主管";
        }
        $scope.role_sale = role_sale;
        console.log(role_sale);
    };
    $scope.choiceManager = function (id, name) {
        $scope.managerId = id;
        $scope.managerName = name;
    };
    $scope.submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "timestamp": $scope.timestamp,
            "email": $scope.email,
            "name": $scope.name,
            "mobile": $scope.mobile,
            "empNo": $scope.empNo,
            "password": $scope.password,
            "role": $scope.role_sale,
            "manager": $scope.managerId,
            "signature": $rootScope.encryptByDES($scope.email + $scope.password + $scope.timestamp),
        };
        $http({
            url: api_uri + "p/user/create",
            method: "POST",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $state.go('super.manage');
            } else {
            }

        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
});

manageCtrl.controller('UserUpdateCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    var timesTamp = new Date().getTime();
    var timesTamp1 = String(timesTamp).substring(0, 10);
    $scope.timestamp = parseInt(timesTamp1);
    $scope.isUpdate = false;

    $scope.get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.isUpdate = true;
                $scope.email = d.result.email;
                $scope.name = d.result.name;
                $scope.mobile = d.result.mobile;
                $scope.empNo = d.result.empNo;
                $scope.password = d.result.password;
                $scope.role_sale = d.result.role;
                $scope.managerId = d.result.manager;
                $scope.managerName = d.result.managerName;
                if ($scope.role_sale == "admin") {
                    $scope.role_sale_see = "销售职员";
                    $scope.list();
                } else if ($scope.role_sale == 'manager') {
                    $scope.role_sale_see = "销售主管";
                }
            }
            else {
            }

        }).error(function (d) {
        })
    };
    $scope.get();
    $scope.list = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/listManager",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.manager_list = d.result;
            }
            else {
            }

        }).error(function (d) {
            //console.log("login error");
            //$location.path("/error");
        })
    };

    $scope.choice = function (role_sale) {
        if (role_sale == 'admin') {
            $scope.role_sale_see = "销售职员";
            $scope.list(1, 20);
        } else if (role_sale == 'manager') {
            $scope.role_sale_see = "销售主管";
        }
        $scope.role_sale = role_sale;
        console.log(role_sale);
    };
    $scope.choiceManager = function (id, name) {
        $scope.managerId = id;
        $scope.managerName = name;
    };

    $scope.submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "timestamp": $scope.timestamp,
            "name": $scope.name,
            "mobile": $scope.mobile,
            "password": $scope.password,
            "role": $scope.role_sale,
            "manager": $scope.managerId,
            "signature": $rootScope.encryptByDES($scope.email + $scope.password + $scope.timestamp),
        };
        $http({
            url: api_uri + "p/user/update/" + $stateParams.id,
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $state.go('super.manage');
            } else {
            }

        }).error(function (d) {
            //$scope.changeErrorMsg("网络故障请稍后再试......");
            //$location.path("/login");
        })
    };
});
;/**
 * Created by baiyang on 2016/7/11.
 */
var signUpCtrl = angular.module('signUpCtrl', []);
signUpCtrl.controller('SignUpCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize,
            "wd": $scope.wd
        };
        $http({
            url: api_uri + "p/user/listUsers",
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
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.refresh_user = function () {
        $scope.list($scope.pageNo1, 20);
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
});
;var bankCtrl = angular.module('bankCtrl', []);
bankCtrl.controller('BankCtrl', function ($http, $scope, $state, $rootScope, $location) {

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

    $scope.list(1, 20);

    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.edit_bank = function (id) {
        $location.path('/super/bank/update/' + id);
    };

    $scope.delete = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            id: id
        };
        $http({
            url: api_uri + "manage/bank/delete",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.list(1, 20);
            }
            else {
            }
        }).error(function (d) {
        });
    };

    $scope.find_detail = function (id, name) {
        $state.go("super.bank.bank_man", {id: id, name: name});
    };

    $scope.changeModule = function (a, b) {
        $scope.editModule = a;
        $scope.deleteModule = b;
    }

});

bankCtrl.controller('BankManCtrl', function ($http, $scope, $rootScope, $location, $stateParams, $state) {
    $scope.selected = [];

    $scope.ids = [];

    $scope.id = $stateParams.id;

    $scope.bankName = $stateParams.name;

    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "bankId": $stateParams.id,
        };
        $http({
            url: api_uri + "manage/bank/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.bank_man_list = d.result.datas;
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

    $scope.add_user = function (id, name) {
        $state.go("super.bank.add_bank_man", {id: id, name: name});
    };

    $scope.delete = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids,
            "bankId": $scope.id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                    //console.log(data);
                }
            },
            error: function (data, textStatus, jqXHR) {
                //console.log(data)
            },
            dataType: 'json',
        });
    };

    $scope.delete_one = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "ids": id,
            "bankId": $scope.id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                }
            },
            error: function (data, textStatus, jqXHR) {
            },
            dataType: 'json',
        });
    };

    $scope.edit_bank_man = function (id) {
        $location.path('/super/bank/update_bank_man/' + id);
    };

});

bankCtrl.controller('AddBankCtrl', function ($http, $scope, $rootScope, $state) {
    $scope.init = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token
        };
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.qiniu_token = d.result.uptoken;
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                    uptoken: $scope.qiniu_token,
                    //	        get_new_uptoken: true,
                    //save_key: true,
                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                    container: 'upload_container',           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '10mb',           //最大文件体积限制
                    flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: false,                   //开启可拖曳上传
                    drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function (up, files) {
                            //                    plupload.each(files, function(file) {
                            //                        // 文件添加进队列后,处理相关的事情
                            //                    });
                        },
                        'BeforeUpload': function (up, file) {
                            $rootScope.uploading = true;
                            $scope.upload_percent = file.percent;
                            $rootScope.$apply();
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                            $scope.upload_percent = file.percent;
                            $scope.$apply();
                        },
                        'FileUploaded': function (up, file, info) {
                            var res = $.parseJSON(info);
                            var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                            //console.log(file_url);
                            $scope.bankPic = file_url;
                            $scope.$apply();
                            m_params.key = "bankPic";
                            m_params.value = $scope.bankPic;
                        },
                        'Error': function (up, err, errTip) {
                            //console.log(err);
                            $rootScope.alert("营业执照上传失败！");
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function (up, file) {
                            var time = new Date().getTime();
                            var k = 'financialProductManage/create/' + m_params.userId + '/' + time;
                            return k;
                        }
                    }
                });
            } else {
            }
        }).error(function (d) {
        });
    };
    $scope.init();

    $scope.submitAdd = function () {
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
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.name,
            "icon": $scope.bankPic,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/add",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    //console.log("创建成功了");
                    $state.go("super.bank");
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };
});

bankCtrl.controller('UpdateBankCtrl', function ($http, $scope, $rootScope, $state, $stateParams) {
    $scope.detail = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "manage/bank/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.bank = d.result;
                $scope.name = d.result.name;
                $scope.bankPic = d.result.icon;
            }
            else {
            }
        }).error(function (d) {
        })
    };
    $scope.detail();
    $scope.init = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.qiniu_token = d.result.uptoken;
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                    uptoken: $scope.qiniu_token,
                    //	        get_new_uptoken: true,
                    //save_key: true,
                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                    container: 'upload_container',           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '10mb',           //最大文件体积限制
                    flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: false,                   //开启可拖曳上传
                    drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function (up, files) {
                            //                    plupload.each(files, function(file) {
                            //                        // 文件添加进队列后,处理相关的事情
                            //                    });
                        },
                        'BeforeUpload': function (up, file) {
                            $rootScope.uploading = true;
                            $scope.upload_percent = file.percent;
                            $rootScope.$apply();
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                            $scope.upload_percent = file.percent;
                            $scope.$apply();
                        },
                        'FileUploaded': function (up, file, info) {
                            var res = $.parseJSON(info);
                            var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                            //console.log(file_url);
                            $scope.bankPic = file_url;
                            $scope.$apply();
                            m_params.key = "bankPic";
                            m_params.value = $scope.bankPic;
                            //$.post(api_uri + "manage/bank/add", m_params,
                            //    function (data) {
                            //        if (data.returnCode == 0) {
                            //            console.log('wodetian')
                            //        } else {
                            //            console.log(data);
                            //        }
                            //    },
                            //    "json");
                        },
                        'Error': function (up, err, errTip) {
                            //console.log(err);
                            $rootScope.alert("营业执照上传失败！");
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function (up, file) {
                            var time = new Date().getTime();
                            var k = 'financialProductManage/create/' + m_params.userId + '/' + time;
                            return k;
                        }
                    }
                });
            } else {
                //console.log(d);
            }
        }).error(function (d) {
            //console.log(d);
        });
    };
    $scope.init();

    $scope.update = function (id) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.name,
            "icon": $scope.bankPic,
            "id": id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/update/" + $stateParams.id,
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    ;
                    $state.go("super.bank");
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json'
        });
    };
});

bankCtrl.controller('AddBankManCtrl', function ($http, $scope, $rootScope, $state, $stateParams, $location, $timeout) {

    $scope.selected = [];
    $scope.ids = [];
    $scope.names = [];
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "bankId": $stateParams.id,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "release": true
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            //console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.product_list = d.result.datas;
            }
            else {
                //console.log(d.result);
            }

        }).error(function (d) {
        })
    };

    $scope.list(1, 20);

    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        //console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id, name) {
        if (action == 'add') {
            $scope.ids.push(id);
            $scope.names.push(name);
            //console.log($scope.ids);
            //console.log($scope.names);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            var name_x = $scope.names.indexOf(name);
            $scope.ids.splice(idx, 1);
            $scope.names.splice(name_x, 1);
        }
    };

    $scope.updateSelection = function ($event, id, name) {
        //console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, name);
    };


    $scope.add_bank_man = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.bank_man.name,
            "bankId": $stateParams.id,
            "branchBankName": $scope.bank_man.branchBank,
            "address": $scope.bank_man.address,
            "position": $scope.bank_man.position,
            "productIds": $scope.ids,
            "mobile": $scope.bank_man.mobile,
            "email": $scope.bank_man.email,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/add",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $state.go("super.bank.bank_man", {id: m_params.bankId});
                    $scope.$apply();
                }
                else {
                    //console.log(data);
                }
            },
            dataType: 'json',
        });
    };


    $scope.show_product = function () {
        $scope.productDiv = true;
    };


    $scope.hide_product = function () {
        $scope.products = "";
        for (var i = 0; i < $scope.names.length; i++) {
            $scope.products += $scope.names[i];
            $scope.products += " ";
        }
        ;
        //console.log($scope.products);
        $scope.productDiv = false;
    }

});

bankCtrl.controller('UpdateBankManCtrl', function ($http, $scope, $rootScope, $state, $stateParams, $location, $timeout, $routeParams) {
    //console.log($stateParams.id);
    $scope.detail = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "manage/bank/user/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            //console.log(d);
            if (d.returnCode == 0) {
                $scope.bank_man = d.result;
                //console.log($scope.bank_man);
                $scope.products = "";
                $scope.list(1, 20);
            }
            else {
                //console.log(d.result);
            }

        }).error(function (d) {
        })
    };
    $scope.detail();
    $scope.selected = [];
    $scope.ids = [];
    $scope.names = [];
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            //"bankId": $scope.bank_man.bankId,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "release": true,
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            //console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.product_list = d.result.datas;
                for (var i = 0; i < $scope.bank_man.productIds.length; i++) {
                    for (var j = 0; j < $scope.product_list.length; j++) {
                        if ($scope.bank_man.productIds[i] == $scope.product_list[j].id) {
                            $scope.names.push($scope.product_list[j].name);
                            $scope.ids.push($scope.product_list[j].id);
                        }
                    }
                }
                $scope.products = ""
                for (var i = 0; i < $scope.names.length; i++) {
                    $scope.products += $scope.names[i];
                    $scope.products += " ";
                }
                ;

            }
            else {
                //console.log(d.result);
            }

        }).error(function (d) {
        })
    };

    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        //console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.isSelected = function (id) {
        return $scope.bank_man.productIds.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id, name) {
        if (action == 'add') {
            $scope.ids.push(id);
            $scope.names.push(name);
            //console.log($scope.ids);
            //console.log($scope.names);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            var name_x = $scope.names.indexOf(name);
            $scope.ids.splice(idx, 1);
            $scope.names.splice(name_x, 1);
        }
    };

    $scope.updateSelection = function ($event, id, name) {
        //console.log("点击一下");
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, name);
    };


    $scope.update = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.bank_man.name,
            "bankId": $scope.bank_man.bankId,
            "branchBankName": $scope.bank_man.branchBankName,
            "address": $scope.bank_man.address,
            "position": $scope.bank_man.position,
            "productIds": $scope.ids,
            "mobile": $scope.bank_man.mobile,
            "email": $scope.bank_man.email,
        };
        //console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/update/" + $stateParams.id,
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    //console.log("添加成功");
                    $state.go("super.bank.bank_man", {id: m_params.bankId});
                    $scope.$apply();

                }
                else {
                    //console.log(data);
                }
            },
            dataType: 'json',
        });
    };


    $scope.show_product = function () {
        $scope.productDiv = true;
    };

    $scope.hide_product = function () {
        $scope.products = "";
        for (var i = 0; i < $scope.names.length; i++) {
            $scope.products += $scope.names[i];
            $scope.products += " ";
        }
        ;
        //console.log($scope.products);
        $scope.productDiv = false;
    }
});
;/**
 * Created by baiyang on 2016/7/7.
 */
var loanApplicationCtrl = angular.module('loanApplicationCtrl', []);
loanApplicationCtrl.controller('LoanApplicationCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            // "status": $scope.status
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
                        data.progressText = "申请中";
                        data.color = 2;
                    }
                });
            }
            else {
                //console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            $location.path("/error");
        })
    };
    $scope.list(1, 20);
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        //console.log($scope.pageNo1);
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
        //console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.refresh = function () {
        $scope.list($scope.pageNo1, 10);
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
            url: api_uri + "loanApplicationManage/delete",
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
});

loanApplicationCtrl.controller('AddCompanyCtrl', function ($http, $scope, $rootScope, $state, $location, $timeout, $routeParams) {
    /*保存基本信息*/
    $scope.basicMessage = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "company_name": $scope.basic.company_name,
            "legal_representative": $scope.basic.legal_representative,
            "register_date": $scope.basic.register_date,
            "registered_capital": $scope.basic.registered_capital,
            "business_address": $scope.basic.business_address,
            "item_category": $scope.basic.item_category,
            "business_type": $scope.basic.business_type,
            "business_scope": $scope.basic.business_scope,
            "linkmanName": $scope.basic.linkmanName,
            "linkmanMobile": $scope.basic.linkmanMobile,
            //"phone": $scope.basic.phone,
            "fee": $scope.basic.fee,
            "loanValue": $scope.basic.loanValue,
            "continual": $scope.basic.continual,
        };
        //console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    //console.log("basic success");
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
    $scope.submitMessage = function () {
        $scope.basicMessage();
    };
});
;var saleManagerCtrl = angular.module('saleManagerCtrl', []);

saleManagerCtrl.controller('SaleManagerCtrl', function ($http, $scope, $state, $rootScope, $location, $routeParams) {
    $scope.list = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/listSaleByManager",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.user_list = d.result;
            }
            else {
                // console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
    };

    $scope.list();
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

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
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
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.ids = [];
                    $scope.list();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    $scope.showDetail = function (id) {
        $location.path('/admin/user_list/sale_apply_list/' + id);
    };
});

saleManagerCtrl.controller('SaleApplyListCtrl', function ($http, $scope, $state, $rootScope, $location, $stateParams) {
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "uid": $stateParams.id,
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
                $scope.result_list = d.result.list.datas;
            }
            else {
                // console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
    };

    $scope.list(1, 100);
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

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };
});
;var myProjectCtrl = angular.module('myProjectCtrl', []);
myProjectCtrl.controller('MyProjectCtrl', function ($http, $scope, $rootScope, $location) {
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
                $scope.page = d.result.list;
                $scope.result_list = d.result.list.datas;
                $scope.count = d.result.count;
                angular.forEach($scope.result_list, function (data) {
                    $scope.status = d.result.status;
                    if (data.status == 0) {
                        data.progressText = "未申请";
                        data.color = 1;
                    } else if (data.status == 1) {
                        data.progressText = "申请中";
                        data.progressBtn = "开始约见";
                        data.color = 2;
                    } else if (data.status == 2) {
                        data.progressText = "约见中";
                        data.progressBtn = "继续跟进";
                        data.color = 2;
                    } else if (data.status == 3) {
                        data.progressText = "跟进中";
                        data.progressBtn = "完成贷款";
                        data.color = 2;
                    } else if (data.status == 4) {
                        data.progressText = "成功融资";
                        data.progressBtn = "已结束";
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
            $location.path("/error");
        })
    };

    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };

    $scope.nextStatus = function (id, status) {
        if (status < 4) {
            status++;
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                status: status
            };
            $http({
                url: api_uri + "loanApplicationManage/next/" + id,
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                }

            }).error(function (d) {
                $location.path("/error");
            })
        } else {
        }

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

    $scope.refresh = function () {
        $scope.list($scope.pageNo1, 10);
    };

    $scope.showDetail = function (id) {
        $location.path('/admin/my_project/detail/' + id);

    };

    $scope.delete = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            ids: $scope.ids,
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };

        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/delete",
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

    $scope.cancel = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
        };
        $http({
            url: api_uri + "loanApplicationManage/cancel",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.list($scope.pageNo1, 10);
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.giveUp = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        // console.log($scope.ids);
        // console.log("baiyang", m_params);
        $.ajax({
            type: 'GET',
            url: api_uri + "loanApplicationManage/giveUp",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    // console.log(data);
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                    // console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.linkCompany = function (id, remark) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
            "remark": remark
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/update",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                }
                else {
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

});

myProjectCtrl.controller('DetailCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    /*添加删除模板*/
    $scope.id = $stateParams.id;

    // $scope.isAllot = '';
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
                $scope.progressText = "申请中";
                $scope.progressBtn = "开始约见";
                $scope.jindu = 20;
            } else if ($scope.status == 2) {
                $scope.progressText = "约见中";
                $scope.progressBtn = "继续跟进";
                $scope.jindu = 50;
            } else if ($scope.status == 3) {
                $scope.progressText = "跟进中";
                $scope.progressBtn = "完成贷款";
                $scope.jindu = 70;
            } else if ($scope.status == 4) {
                $scope.progressText = "成功融资";
                $scope.progressBtn = "已结束";
                $scope.jindu = 100;
            } else if ($scope.status == -1) {
                $scope.progressText = "申请取消";
            }
        }).error(function (d) {

        })
    };
    $scope.get();

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
            console.log(d);
            $scope.message_list = d.result;
        }).error(function (d) {

        })
    };
    $scope.get_message();

    $scope.editApply = function (id) {
        if ($scope.type == 2) {
            alert('个人产品暂不支持修改信息');
        } else {
            $location.path('/admin/my_project/edit_apply/' + id);
        }

    };
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
            // console.log(d);
            if (d.returnCode == 0) {
                $rootScope.putSessionObject('from_route', 'admin.my_project');
                $rootScope.showBtn = 2;
            }
            else {
                //console.log(d);
            }

        }).error(function (d) {
        })
    };

    $scope.apply_help = function (id) {
        $location.path('/admin/my_project/apply_help/' + id);
    };

    $scope.apply_again = function (id, mobile) {
        $location.path('/admin/my_project/apply_again/' + id + '/' + mobile);
    };

    $scope.messages = function (id) {
        $location.path('/admin/my_project/message/' + id);
    };

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
                    // alert('留言成功');
                    $scope.content = '';
                    $scope.get_message();
                }
                else {
                    alert('留言失败');
                }
            },
            dataType: 'json',
        });

    };

    $scope.distribute = function (id) {
        $location.path('/admin/my_project/distribute/' + id);
    };

    $scope.add_fee = function () {
        $(".add-fee").css("display", "block");
        $(".add-loan").css("display", "none");
    };
    $scope.add_loan = function () {
        $(".add-loan").css("display", "block");
        $(".add-fee").css("display", "none");
    };
    $scope.cancel_add = function () {
        $(".add-fee").css("display", "none");
        $(".add-loan").css("display", "none");
    };
    $scope.update_loan = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "loanValue": $scope.loanValue,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/updateLoanValue",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $(".add-loan").css("display", "none");
                    $scope.get();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };
    $scope.update_fee = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "fee": $scope.fee,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/updateFee",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $(".add-fee").css("display", "none");
                    $scope.get();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    $scope.reBackDetails = function () {
        var from_route = $rootScope.getSessionObject("from_route");
        var from_route2 = $rootScope.getSessionObject("from_route2");
        var from_params = $rootScope.getSessionObject("from_params");
        if (from_route == "admin.my_project" || from_route == "admin.company_message") {
            $state.go(from_route);
        } else if (from_route2 == null) {
            $state.go(from_route);
        } else {
            $location.path(from_route2 + from_params);
        }
    };

    $scope.change_company = function (id) {
        $location.path('/admin/my_project/change_company/' + id);
        // console.log(id);
    };

});

myProjectCtrl.controller('EditApplyCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams, $routeParams) {
    /*添加删除模板*/
    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
    $scope.get = function () {
        $scope.get_id_arr = [];
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token
        };
        $http({
            url: api_uri + "inforTemplate/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            $scope.basic = d.result.baseInfo;
            $scope.registerLinkmanName = d.result.registerLinkmanName;
            $scope.registerLinkmanMobile = d.result.registerLinkmanMobile;
            $scope.model_list = d.result.templateList;
            $scope.img_model_count = 0;
            $scope.img_model_arr = [];
            for (var i = 0, j = 0; i < $scope.model_list.length; i++) {
                $scope.model_list[i].id_model = i;
                if ($scope.model_list[i].templateType == 3) {
                    $scope.model_list[i].img_model_id = "img_model" + j;
                    $scope.model_list[i].img_model_div = "imgList_model" + j;
                    $scope.img_model_arr.push(j);
                    $scope.img_model_count++;
                    j++;
                }
            }
            console.log($scope.model_list);
            console.log($scope.img_model_arr);
            $scope.picSave();
        }).error(function (d) {
        })
    };
    $scope.get();

    $scope.model = {
        title: "",
        content: "",
        name: ""
    };
    $scope.picSave = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token
        };
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.qiniu_token = d.result.uptoken;
                $scope.saveImg = 0;
                for (var i = 0; i < $scope.img_model_count; i++) {
                    if (i == 0) {
                        var uploader = Qiniu.uploader({
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model0',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model0',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                },
                                'BeforeUpload': function (up, file) {
                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        });
                    } else if (i == 1) {
                        var Q2 = new QiniuJsSDK();
                        var uploader2 = Q2.uploader({
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model1',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model1',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        });
                        console.log(uploader2);
                    } else if (i == 2) {
                        var Qiniu3 = new QiniuJsSDK();
                        var uploader3 = Qiniu3.uploader({
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model2',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model2',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        });
                        console.log(uploader3);
                    } else if (i == 3) {
                        var Qiniu4 = new QiniuJsSDK();
                        var option4 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model3',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model3',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader4 = Qiniu4.uploader(option4);
                    } else if (i == 4) {
                        var Qiniu5 = new QiniuJsSDK();
                        var option5 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model4',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model4',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader5 = Qiniu5.uploader(option5);
                    } else if (i == 5) {
                        var Qiniu6 = new QiniuJsSDK();
                        var option6 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model5',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model5',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader6 = Qiniu6.uploader(option6);
                    } else if (i == 6) {
                        var Qiniu7 = new QiniuJsSDK();
                        var option7 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model6',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model6',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader7 = Qiniu7.uploader(option7);
                    } else if (i == 7) {
                        var Qiniu8 = new QiniuJsSDK();
                        var option8 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model7',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model7',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader8 = Qiniu8.uploader(option8);
                    } else if (i == 8) {
                        var Qiniu9 = new QiniuJsSDK();
                        var option9 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model9',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model8',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader9 = Qiniu9.uploader(option9);
                    } else if (i == 9) {
                        var Qiniu10 = new QiniuJsSDK();
                        var option10 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model9',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model9',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                    //                    plupload.each(files, function(file) {
                                    //                        // 文件添加进队列后,处理相关的事情
                                    //                    });
                                },
                                'BeforeUpload': function (up, file) {

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader10 = Qiniu10.uploader(option10);

                    }


                }
                ;
                $scope.get_id = function (d) {
                    $scope.saveImg = d;
                    console.log($scope.saveImg);
                };
            } else {
            }
        }).error(function (d) {
        });

    };
    $scope.addModel = function (templateType) {
        if ($scope.model_list) {
            var id_model = $scope.model_list.length;
        } else {
            $scope.model_list = [];
            var id_model = 0;
        }
        $scope.model_list.push({
            "id_model": id_model,
            "templateType": templateType,
            "title": $scope.model.title,
            "content": $scope.model.content,
            "name": "",
            "imgList": []
        });
        if (templateType == 3) {
            $scope.model_list[id_model].img_model_id = "img_model" + $scope.img_model_count;
            $scope.model_list[id_model].img_model_div = "imgList_model" + $scope.img_model_count;
            console.log($scope.img_model_count);
            $scope.img_model_count++;
            $scope.picSave();
        }
        id_model++;
    };
    $scope.delete = function (id) {
        $scope.model_list.splice(id, 1);
    };
    /*保存基本信息*/

    $scope.basicMessage = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "applyId": $stateParams.id,
            "id": $scope.basic.id,
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "company_name": $scope.basic.company_name,
            "legal_representative": $scope.basic.legal_representative,
            "register_date": $scope.basic.register_date,
            "registered_capital": $scope.basic.registered_capital,
            "business_address": $scope.basic.business_address,
            "item_category": $scope.basic.item_category,
            "business_type": $scope.basic.business_type,
            "business_scope": $scope.basic.business_scope,
            "linkmanName": $scope.basic.linkmanName,
            "linkmanMobile": $scope.basic.linkmanMobile,
            // "fee": $scope.basic.fee,
            // "loanValue": $scope.basic.loanValue,
            "continual": $scope.basic.continual,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveBase",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.id_basic = data.result;
                    $scope.other();
                    //$scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    /*保存其他信息*/
    $scope.other = function () {
        var list = [];
        //var list_string = [];
        for (var i = 0; i < $scope.model_list.length; i++) {
            list.push({
                "title": $scope.model_list[i].title,
                "name": $scope.model_list[i].name,
                "templateType": $scope.model_list[i].templateType,
                "content": $scope.model_list[i].content,
                "imgList": $scope.model_list[i].imgList
            })
        }
        ;
        //var list_string = JSON.stringify(list);
        var m_params1 = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "comId": $scope.id_basic,
            "list": JSON.stringify(list)
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveList",
            data: m_params1,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $location.path("admin/my_project/detail/" + $stateParams.id);
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };
    $scope.submitMessage = function () {
        $scope.basicMessage();
    };
    $scope.saveImg = "";
    $scope.removeImgList = function (id, index) {
        id.splice(index, 1);
    };
});

myProjectCtrl.controller('DistributeCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams, $stateParams) {
    /*添加删除模板*/
    $scope.id = $stateParams.id;

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

    $scope.bank_man_list = function (id, pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "bankId": id
        };
        $http({
            url: api_uri + "manage/bank/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.bank_man_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.choiceBankMan = function (id, name) {
        $scope.bankManId = id;
        $scope.bankManName = name;
    }
    $scope.sumbit_user = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": $scope.id,
            "bankUserId": $scope.bankManId
        };
        $http({
            url: api_uri + "loanApplicationManage/allot/",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                alert("递交成功");
                //$state.go("master.my_project");
                $location.path('/admin/my_project/detail/' + $scope.id);
            }
            else {
                alert("递交失败");
            }
        }).error(function (d) {
        })
    };

    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
        $scope.bank_man_list($scope.bankId, 1, 400)
    };
});

myProjectCtrl.controller('ApplyHelpCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    /*添加删除模板*/
    $scope.id = $stateParams.id;
    if ($stateParams.mobile) {
        $scope.applyMobile = $stateParams.mobile;
    }

    $scope.get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $scope.id,
        };
        $http({
            url: api_uri + "loanApplicationManage/getProduct",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.bankName = d.result.bankName;
                $scope.productName = d.result.productName;
                $scope.productId = d.result.productId;
            }
            else {
            }
        }).error(function (d) {
        })
    };
    $scope.get();

    $scope.backProjectDetail = function (id) {
        // console.log(id);
        $location.path('/admin/my_project/detail/' + id);
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

    $scope.editApply = function (id) {
        $location.path('/admin/my_project/edit_apply/' + id);
    };

    $scope.choiceProduct = function (id, name, type) {
        $scope.productId = id;
        $scope.productName = name;
        if (type == 2) {
            alert('企业不可以申请个人产品，请更换');
            $scope.productName = '';
        }
    };

    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
        $scope.product_list($scope.bankId, 1, 400)
    };
    $scope.product_list = function (id, pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "bankId": id,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "release": true
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $scope.page = d.result;
                $scope.product_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.submit_help = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "productId": $scope.productId,
            "mobile": $scope.applyMobile,
        };
        console.log(m_params);
        if (m_params.mobile && m_params.mobile != '') {
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/helpApply",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    // console.log(data);
                    if (data.returnCode == 0) {
                        $location.path('/admin/my_project/detail/' + $scope.id);
                        $scope.$apply();
                    }
                    else {
                    }
                },
                dataType: 'json',
            });
        } else {
            alert("手机号不能为空");
        }

    };
});

myProjectCtrl.controller('ChangeCompanyCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    $scope.change = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "mobile": $scope.phone,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "/loanApplicationManage/changeMobile",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    // console.log("创建成功了");
                    $location.path('/admin/my_project/detail/' + $stateParams.id);
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
});

myProjectCtrl.controller('MessageCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
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
    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
});
;var channelCtrl = angular.module('channelCtrl', []);

channelCtrl.controller('ChannelCtrl', function ($http, $scope, $state, $rootScope, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            // "wd": wd,
            // "shareId": shareId,
        };
        $http({
            url: api_uri + "wxShare/manager/customerList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                // console.log(d.result);
                if (d.result != undefined) {
                    $scope.user_list = d.result.datas;
                }

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
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.cancel = function () {
        // var login_user = $rootScope.getObject("login_user");
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
                // console.log(data);
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

    $scope.showDetail = function (id) {
        $location.path('/admin/channel/detail/' + id);
    };
});

channelCtrl.controller('CreateCtrl', function ($http, $scope, $state, $rootScope, $location, $routeParams) {
    $scope.submit = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.username,
            "mobile": $scope.phone,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/addCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $state.go("admin.channel");
                    $scope.$apply();

                } else if (data.returnCode == 1003) {
                    alert("该手机号不是直融号用户");
                } else if (data.returnCode == 1004) {
                    alert("该用户已经被分配");
                }
                else {
                }
            },
            dataType: 'json',
        });

    };
});

channelCtrl.controller('ChannelDetailCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "uid": $stateParams.id
        };
        $http({
            url: api_uri + "wxShare/manager/customerApplyList",
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
            //console.log("login error");
            // $location.path("/error");
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

    $scope.cancel = function () {
        // var login_user = $rootScope.getObject("login_user");
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
                // console.log(data);
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

    $scope.addApply = function () {
        $location.path('/admin/channel/add_apply/' + $stateParams.id);
    };

    $scope.history = function () {
        $location.path('/admin/channel/history/' + $stateParams.id);
    };

    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };
});

channelCtrl.controller('AddApplyCtrl', function ($http, $scope, $state, $rootScope, $location, $stateParams) {
    $scope.getApply = function () {
        // var login_user = $rootScope.getObject("login_user");
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
            //console.log("login error");
            // $location.path("/error");
        })
    };

    $scope.submit = function (id, name) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": id,
            "uid": $stateParams.id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/addChannel",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $location.path('/admin/channel/detail/' + $stateParams.id);
                    $scope.$apply();

                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    $scope.back = function () {
        $location.path('/admin/channel/detail/' + $stateParams.id);
    };
});

channelCtrl.controller('HistoryCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
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
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };
    $scope.ids = [];
    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.goBackDetail = function () {
        $location.path('/admin/channel/detail/' + $stateParams.id);
    };
    $scope.change_company = function (id) {
        $location.path('/admin/channel/change/' + $stateParams.id + '/' + id);
    };

});

channelCtrl.controller('ChangeCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
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
                    $location.path('/admin/channel/history/' + $stateParams.id);
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

});
;var shareCtrl = angular.module('shareCtrl', []);

shareCtrl.controller('ShareCtrl', function ($http, $scope, $state, $rootScope, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
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
            // console.log(d);
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

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };
    $scope.remark = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        // console.log($scope.ids);
        // console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/toCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    // console.log(data);
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
        // console.log(id);
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
            // console.log(d);
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
                // console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
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

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.cancel = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        // console.log($scope.ids);
        // console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/cancelCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    // console.log(data);
                    $scope.ids = [];
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                    // console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };
});
;var messageCtrl = angular.module('messageCtrl', []);
messageCtrl.controller('MessageBankCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.init = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "applyBankDeal/manage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $scope.message_list = d.result.datas;
            angular.forEach($scope.message_list, function (data) {
                //$scope.status = d.result.status;
                data.dayNum = ''
                if (data.status == 0) {
                    data.progressText = "未申请";
                } else if (data.status == 1) {
                    data.progressText = "约见中";
                    data.progressTextNext = "申请中";
                    data.jindu = 20;
                    data.jindu_next = 30;
                } else if (data.status == 2) {
                    data.progressText = "申请中";
                    data.progressTextNext = "约见中";
                    data.jindu = 20;
                    data.jindu_next = 30;
                } else if (data.status == 3) {
                    data.progressText = "约见中";
                    data.progressTextNext = "跟进中";
                    data.jindu = 50;
                    data.jindu_next = 25;
                } else if (data.status == 4) {
                    data.progressText = "跟进中";
                    data.progressTextNext = "成功融资";
                    data.progressBtn = "已结束";
                    data.jindu = 75;
                    data.jindu_next = 25;
                } else if (data.status == -1) {
                    data.progressText = "申请取消";
                }
            });

        }).error(function (d) {
            // console.log(d);
        });
    };
    $scope.init();
    $scope.showAllow = [];
    $scope.show_allow = function (status, id) {
        $scope.showAllow[id] = true;
        $scope.status = status;
        if (status == 2) {
            $scope.statusText = "约见中";
        } else if (status == 3) {
            $scope.statusText = "跟进中";
        } else if (status == 4) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.choiceStatus = function (status) {
        $scope.status = status;
        if (status == 2) {
            $scope.statusText = "约见中";
        } else if (status == 3) {
            $scope.statusText = "跟进中";
        } else if (status == 4) {
            $scope.statusText = "成功融资";
        }
    };
    $scope.cancel = function (id) {
        $scope.showAllow[id] = false;
    };
    $scope.allow = function (dayNum, id, index) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "status": $scope.status,
            "dayNum": dayNum,
            "id": id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "applyBankDeal/manage/allow",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $scope.showAllow[index] = false;
            $scope.init();

        }).error(function (d) {
            // console.log(d);
        });
    };

    $scope.refuse = function (id) {
        $scope.reason_refuse = $("#reason_refuse").val();
        // console.log($scope.reason_refuse);
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
            "reason": $scope.reason_refuse,
        };
        // console.log(m_params);
        $http({
            url: api_uri + "applyBankDeal/manage/refuse",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);

        }).error(function (d) {
            // console.log(d);
        });
    }
});

messageCtrl.controller('MessageSystemCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "zrh/message/lists",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $scope.page = d.result;
            $scope.result_list = d.result.datas;
        }).error(function (d) {
            // console.log(d);
        });
    };
    $scope.list(1, 20);
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        // console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.to_company_message = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
        };
        $http({
            url: api_uri + "zrh/message/details",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            $location.path('/admin/company_message');
        }).error(function (d) {
            // console.log(d);
        });
    };
});
;api_uri = "http://test.zhironghao.com/api/";
// api_uri = "http://api.supeiyunjing.com/";
//api_uri = "http://172.17.2.13:8080/api/";
// api_uri = "http://172.16.97.95:8080/api/";
var templates_root = 'templates/';
deskey = "abc123.*abc123.*abc123.*abc123.*";
var app = angular.module('app', [
    'ng',
    'ngRoute',
    'ngAnimate',
    'ui.router',

    'loginCtrl',
    'topBarCtrl',
    'applyListCtrl',
    'loanApplicationCtrl',
    'productCtrl',
    'myProjectCtrl',
    'saleManagerCtrl',
    'manageCtrl',
    'signUpCtrl',
    'bankCtrl',
    'channelCtrl',
    'shareCtrl',
    // 'accountCtrl',
    'messageCtrl',

], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

});


app.run(function ($location, $rootScope, $http) {

    /*********************************** 回调区 ***************************************/
    // 页面跳转后
    $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";

    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            var present_route = toState.name; //获取当前路由
            if (present_route.indexOf('admin.my_project.detail') > -1) {
                var from_route = fromState.name;
                // console.log(fromState.name);
                // console.log(fromState);
                if (from_route != "" && from_route.indexOf('admin.my_project.edit_apply') <= -1
                    && from_route.indexOf('admin.my_project.change_company') <= -1
                    && from_route.indexOf('admin.my_project.apply_again') <= -1) {
                    $rootScope.putSessionObject('from_route', from_route);
                    var get_route = $rootScope.getSessionObject('from_route');
                    // console.log(get_route);
                    if (get_route == "admin.company_message") {
                        $rootScope.showBtn = 1;
                        // console.log($rootScope.showBtn);
                    } else {
                        $rootScope.showBtn = 2;
                        // console.log($rootScope.showBtn);
                    }
                    if (fromParams.id) {
                        var arrayParams = from_route.split(".");
                        var from_route2 = "/" + arrayParams[0] + "/" + arrayParams[1] + "/" + arrayParams[2] + "/";
                        if (arrayParams[2] != 'edit_apply') {
                            $rootScope.putSessionObject('from_route2', from_route2);
                        }
                        var from_params = fromParams.id;
                        // console.log(from_params);
                        $rootScope.putSessionObject('from_params', from_params);

                    }
                } else {
                    var get_route = $rootScope.getSessionObject('from_route');
                    // console.log(get_route);
                    if (get_route == "admin.company_message") {
                        $rootScope.showBtn = 1;
                        // console.log($rootScope.showBtn);
                    } else {
                        $rootScope.showBtn = 2;
                        // console.log($rootScope.showBtn);
                    }
                }
            }
            var array = present_route.split(".");
            $rootScope.choiceColor = array[1];
            if (array[1] == "message") {
                // console.log(array[1], 'baiyang');
                $rootScope.sideTwo = true;
                $rootScope.choiceColorTwo = array[2];
            } else {
                $rootScope.sideTwo = false;
            }
        });
    // 页面跳转前
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            var present_route = toState.name;
            $rootScope.arrayParams = present_route.split(".");
            if ($location.$$path != '/login') {
                $rootScope.check_user();
            } else {
            }
            if (!$rootScope.login_user) {
                $location.path("/login");
            } else {
            }
        });
    /*********************************** 公用方法区 ***************************************/

    //加密 3des
    $rootScope.encryptByDES = function (message) {
        var keyHex = CryptoJS.enc.Utf8.parse(deskey);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    };
    //解密
    $rootScope.decryptByDES = function (ciphertext) {
        var keyHex = CryptoJS.enc.Utf8.parse(deskey);

        // direct decrypt ciphertext
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    $rootScope.transFn = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&").toString();
    };
    /*********************************** 全局变量区 ***************************************/

    $rootScope.putObject = function (key, value) {
        localStorage.setItem(key, angular.toJson(value));
    };
    $rootScope.getObject = function (key) {
        return angular.fromJson(localStorage.getItem(key));
    };
    $rootScope.removeObject = function (key) {
        localStorage.removeItem(key);
    };

    $rootScope.putSessionObject = function (key, value) {
        sessionStorage.setItem(key, angular.toJson(value));
    };
    $rootScope.getSessionObject = function (key) {
        return angular.fromJson(sessionStorage.getItem(key));
    };
    $rootScope.removeSessionObject = function (key) {
        angular.fromJson(sessionStorage.removeItem(key));
    };

    $rootScope.getAccountInfo = function () {
        if ($rootScope.account_info == {}) {
            $rootScope.account_info = $rootScope.putSessionObject('account_info');
        }
        if (!$rootScope.account_info) {
            $rootScope.account_info = {};
        }
        return $rootScope.account_info;
    };

    $rootScope.setAccountInfo = function (account_info) {
        $rootScope.account_info = account_info;
        $rootScope.putSessionObject('account_info', $rootScope.account_info);
    };

    $rootScope.updateAccountInfo = function (dict) {
        $rootScope.account_info = $rootScope.getAccountInfo();
        for (var key in dict) {
            $rootScope.account_info[key] = dict[key];
        }
        $rootScope.putSessionObject('account_info', $rootScope.account_info);
    };

    $rootScope.setAccountInfoKeyValue = function (key, value) {
        $rootScope.account_info = $rootScope.getAccountInfo();
        $rootScope.account_info[key] = value;
        $rootScope.putSessionObject('account_info', $rootScope.account_info);
    };

    $rootScope.getAccountInfoKeyValue = function (key) {
        if ($rootScope.account_info != {}) {
            $rootScope.account_info = $rootScope.putSessionObject('account_info');
        }
        if ($rootScope.account_info) {
            return $rootScope.account_info[key];
        } else {
            return null;
        }
    };

    $rootScope.check_user = function () {
        $rootScope.login_user = $rootScope.getObject("login_user");
        if ($rootScope.login_user) {
            $http({
                url: api_uri + "p/user/validateAuth",
                method: "POST",
                params: $rootScope.login_user
            }).success(function (d) {
                // console.log(d);
                if (d.returnCode == 0) {
                    $rootScope.check_role();
                    return true;
                } else {
                    $rootScope.login_user = {};
                    $rootScope.removeObject("login_user");
                    return false;
                }
            }).error(function (d) {
                return false;
            });
        } else {
        }

    };

    $rootScope.check_role = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/detail/" + $rootScope.login_user.userId,
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                // console.log(d);
                $rootScope.role = d.result.role;
                if ($rootScope.role == 'super') {
                    // console.log($rootScope.arrayParams[0]);
                    if ($rootScope.arrayParams[0] == 'super') {
                    } else {
                        // console.log($rootScope.arrayParams[0]);
                        $location.path("/login");
                    }
                } else if ($rootScope.role == 'admin') {
                    // console.log($rootScope.arrayParams[0]);
                    if ($rootScope.arrayParams[0] == 'admin') {
                        if ($rootScope.arrayParams[1] == 'user_list') {
                            $location.path("/login");
                        } else {
                        }
                    } else {
                        $location.path("/login");
                    }
                } else if ($rootScope.role == 'manager') {
                    // console.log($rootScope.arrayParams[0]);
                    if ($rootScope.arrayParams[0] == 'admin') {
                    } else {
                        $location.path("/login");
                    }
                }
            } else {
            }

        }).error(function (d) {
        })
    };
});
;/**
 * Created by baiyang on 2016/7/7.
 */
//路由设定
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
        .otherwise('/login');
    $stateProvider
        .state("login", {
            url: '/login',
            views: {
                '': {
                    templateUrl: templates_root + 'login/index.html',
                    controller: 'LoginCtrl'
                },
            }
        })

        .state("super", {
            url: '/super',
            views: {
                '': {
                    templateUrl: templates_root + 'super/index.html',
                    //controller: 'UserIndexController'
                },
                'top_bar@super': {
                    templateUrl: templates_root + 'bar/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@super': {
                    templateUrl: templates_root + 'bar/side_bar.html',
                    //controller: 'TopBarCtrl'
                },
                'main@super': {
                    templateUrl: templates_root + 'super/main.html',
                    // controller: 'UserListCtrl'
                }
            }
        })

        .state('super.apply_list', {
            url: '/apply_list',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/apply_list/apply_list.html',
                    controller: 'ApplyListCtrl'
                }
            }
        })

        .state('super.manage', {
            url: '/manage',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/user_list.html',
                    controller: 'UserListCtrl'
                }
            }
        })
        .state("super.manage.addUser", {
            url: '/add_user',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/add_user.html',
                    controller: 'CreateUserCtrl'
                }
            }
        })
        .state("super.manage.update", {
            url: '/update/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/manage/user_update.html',
                    controller: 'UserUpdateCtrl'
                }
            }
        })

        .state('super.product', {
            url: '/product',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/product.html',
                    controller: 'ProductCtrl'
                }
            }
        })
        .state('super.product.create', {
            url: '/create',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/create.html',
                    controller: 'ProductCreateCtrl'
                }
            }
        })
        .state('super.product.update', {
            url: '/update/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/update.html',
                    controller: 'ProductUpdateCtrl'
                }
            }
        })
        .state('super.product.sort', {
            url: '/sort',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/product/sort.html',
                    controller: 'SortCtrl'
                }
            }
        })

        .state('super.bank', {
            url: '/bank',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/bank.html',
                    controller: 'BankCtrl'
                }
            }
        })
        .state('super.bank.bank_man', {
            params: {
                "id": null,
                "name": null
            },
            url: '/bank_man/:id/:name',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/bank_man.html',
                    controller: 'BankManCtrl'
                }
            }
        })
        .state('super.bank.add_bank', {
            params: {
                "id": null,
                "name": null
            },
            url: '/add_bank/:id/:name',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank.html',
                    controller: 'AddBankCtrl'
                }
            }
        })
        .state('super.bank.add_bank_man', {
            url: '/add_bank_man/:id/:name',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/add_bank_man.html',
                    controller: 'AddBankManCtrl'
                }
            }
        })
        .state('super.bank.update', {
            url: '/update/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/update.html',
                    controller: 'UpdateBankCtrl'
                }
            }
        })
        .state('super.bank.update_bank_man', {
            url: '/update_bank_man/:id',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/bank/update_bank_man.html',
                    controller: 'UpdateBankManCtrl'
                }
            }
        })

        .state('super.signUp', {
            url: '/signUp',
            views: {
                'main@super': {
                    templateUrl: templates_root + 'super/product_service/sign_up/sign_up.html',
                    controller: 'SignUpCtrl'
                }
            }
        })

        .state("admin", {
            url: '/admin',
            views: {
                '': {
                    templateUrl: templates_root + 'admin/index.html',
                    //controller: 'UserIndexController'
                },
                'top_bar@admin': {
                    templateUrl: templates_root + 'bar/top_bar.html',
                    controller: 'TopBarCtrl'
                },
                'side_bar@admin': {
                    templateUrl: templates_root + 'bar/side_bar.html',
                    controller: 'SideBarCtrl'
                },
                'contains@admin': {
                    templateUrl: templates_root + 'admin/contains.html',
                    controller: 'ContainsCtrl'
                }
            }
        })

        .state("admin.company_message", {
            url: '/company_message',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/company_message/company_message.html',
                    controller: 'LoanApplicationCtrl'
                }
            }
        })
        .state('admin.company_message.add_company', {
            url: '/add_company',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/company_message/add_company.html',
                    controller: 'AddCompanyCtrl'
                }
            }
        })

        .state('admin.my_project', {
            url: '/my_project',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/my_project.html',
                    controller: 'MyProjectCtrl'
                }
            }
        })
        .state('admin.my_project.detail', {
            url: '/detail/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/detail.html',
                    controller: 'DetailCtrl'
                }
            }
        })
        .state('admin.my_project.edit_apply', {
            url: '/edit_apply/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/edit_apply.html',
                    controller: 'EditApplyCtrl'
                }
            }
        })
        .state('admin.my_project.distribute', {
            url: '/distribute/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/distribute.html',
                    controller: 'DistributeCtrl'
                }
            }
        })
        .state('admin.my_project.apply_help', {
            url: '/apply_help/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/apply_help.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('admin.my_project.apply_again', {
            url: '/apply_again/:id/:mobile',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/apply_again.html',
                    controller: 'ApplyHelpCtrl'
                }
            }
        })
        .state('admin.my_project.change_company', {
            url: '/change_company/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/change.html',
                    controller: 'ChangeCompanyCtrl'
                }
            }
        })
        .state('admin.my_project.message', {
            url: '/message/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/my_project/message.html',
                    controller: 'MessageCtrl'
                }
            }
        })

        .state("admin.user_list", {
            url: '/user_list',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'manager/user_list.html',
                    controller: 'SaleManagerCtrl'
                }
            }
        })
        .state("admin.user_list.sale_apply_list", {
            url: '/sale_apply_list/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'manager/sale_apply_list.html',
                    controller: 'SaleApplyListCtrl'
                }
            }
        })
        // .state("admin.user_list.sale_apply_list.detail", {
        //     url: '/detail',
        //     views: {
        //         'contains@admin': {
        //             templateUrl: templates_root + 'manager/detail.html',
        //             controller: 'SaleApplyListCtrl'
        //         }
        //     }
        // })

        .state('admin.statistics', {
            url: '/statistics',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/statistics/share/statistics.html',
                    // controller:'StatisticsCtrl'
                }
            }
        })
        .state('admin.statistics.person', {
            url: '/person',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/statistics/share/person.html',
                    // controller:'PersonCtrl'
                }
            }
        })
        .state('admin.channel', {
            url: '/channel',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/channel.html',
                    controller: 'ChannelCtrl'
                }
            }
        })
        .state('admin.channel.create', {
            url: '/create',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/create.html',
                    controller: 'CreateCtrl'
                }
            }
        })
        .state('admin.channel.detail', {
            url: '/detail/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/detail.html',
                    controller: 'ChannelDetailCtrl'
                }
            }
        })
        .state('admin.channel.add_apply', {
            url: '/add_apply/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/add_apply.html',
                    controller: 'AddApplyCtrl'
                }
            }
        })
        .state('admin.channel.history', {
            url: '/history/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/history.html',
                    controller: 'HistoryCtrl'
                }
            }
        })
        .state('admin.channel.change', {
            url: '/change/:id/:idt',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/channel/change.html',
                    controller: 'ChangeCtrl'
                }
            }
        })

        .state('admin.share', {
            url: '/share',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/share/share.html',
                    controller: 'ShareCtrl'
                }
            }
        })
        .state('admin.share.share_detail', {
            url: '/share_detail/:id',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/product_service/share/share_detail.html',
                    controller: 'ShareDetailCtrl'
                }
            }
        })

        // .state('admin.account', {
        //     url: '/account',
        //     views: {
        //         'contains@admin': {
        //             templateUrl: templates_root + 'admin/user_center/account/account.html',
        //             controller: 'AccountCtrl'
        //         }
        //     }
        // })
        .state('admin.message', {
            url: '/message',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/message.html',
                    //controller: 'MessageCtrl'
                }
            }
        })
        .state('admin.message.company', {
            url: '/company',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/company.html',
                    //controller:'MessageCompanyCtrl'
                }
            }
        })
        .state('admin.message.bank', {
            url: '/bank',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/bank.html',
                    controller: 'MessageBankCtrl'
                }
            }
        })
        .state('admin.message.apply', {
            url: '/apply',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/apply.html',
                    //controller:'MessageApplyCtrl'
                }
            }
        })
        .state('admin.message.system', {
            url: '/system',
            views: {
                'contains@admin': {
                    templateUrl: templates_root + 'admin/user_center/message/system.html',
                    controller: 'MessageSystemCtrl'
                }
            }
        })
});