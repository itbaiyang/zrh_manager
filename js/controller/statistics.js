var statisticsCtrl = angular.module('statisticsCtrl', []);
statisticsCtrl.controller('StatisticsCtrl', function ($http, $scope,$state, $rootScope, $location, $routeParams) {

});

statisticsCtrl.controller('PersonCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {
    var log = function (date) {
        s = new Date(date);
        var y = s.getFullYear();
        var m = s.getMonth()+1;
        var d = s.getDate();
        var format_date = y+'-'+m+'-'+d;
        return format_date;
        $scope.list(1,10);
    };
    $scope.count = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        console.log(m_params);
        $http({
            url: api_uri + "wxShare/manager/count",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.count = d.result;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
    };
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "startTime": $scope.date_start,
            "endTime": $scope.date_end,
             "wd": $scope.search_text,
        };
        console.log(m_params);
        $http({
            url: api_uri + "wxShare/manager/applyList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.share_list = d.result.datas;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
    };
    $scope.count();
    $scope.list(1, 20);

    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
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
            console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下");
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.search_text = null;
    $scope.search = function () {
        if($scope.start_date){
            $scope.date_start = log($scope.start_date);
        }
        if($scope.end_date){
            $scope.date_end = log($scope.end_date);
        }
        $scope.list(1, 20);
    };

    $scope.refresh = function(){
        $scope.list($scope.pageNo1, 10);
    };
});

statisticsCtrl.controller('ChannelCtrl', function ($http, $scope,$state, $rootScope, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
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
                $scope.user_list = d.result.datas;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
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
    $scope.ids=[];
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
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
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/cancelCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log(data);
                    $scope.ids=[];
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.showDetail = function (id) {
        $location.path('/master/statistics/channel/detail/' + id);
        console.log(id);
    };
});

statisticsCtrl.controller('CreateCtrl', function ($http, $scope,$state, $rootScope, $location, $routeParams) {
    $scope.submit = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
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
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("创建成功了");
                    $state.go("master.statistics.channel");
                    $scope.$apply();

                }else if (data.returnCode == 1003) {
                    alert("该手机号不是直融号用户");
                }else if (data.returnCode == 1004) {
                    alert("该用户已经被分配");
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});

statisticsCtrl.controller('ChannelDetailCtrl', function ($http, $scope,$state, $rootScope,$stateParams, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "uid":$stateParams.id
        };
        console.log(m_params);
        $http({
            url: api_uri + "wxShare/manager/customerApplyList",
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
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
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
    $scope.ids=[];
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
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
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/cancelCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log(data);
                    $scope.ids=[];
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.addApply = function () {
        $location.path('/master/statistics/channel/add_apply/' + $stateParams.id);
        console.log($stateParams.id);
    };
});

statisticsCtrl.controller('AddApplyCtrl', function ($http, $scope,$state, $rootScope, $location, $stateParams) {
    $scope.getApply = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "companyName":$scope.companyName
        };
        console.log(m_params);
        $http({
            url: api_uri + "loanApplicationManage/listByCompanyName",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
    };

    $scope.submit = function (id,name) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            "applyId": id,
            "uid":$stateParams.id
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/addChannel",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $location.path('/master/statistics/channel/detail/' + $stateParams.id);
                    $scope.$apply();

                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.back = function () {
        $location.path('/master/statistics/channel/detail/' + $stateParams.id);
        console.log($stateParams.id);
    };
});

statisticsCtrl.controller('ShareCtrl', function ($http, $scope,$state, $rootScope, $location, $routeParams) {
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
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.user_list = d.result.datas;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
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
    $scope.ids=[];
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
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
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/toCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log(data);
                    $scope.list($scope.pageNo1, 10);
                    $scope.ids=[];
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
    $scope.showDetail = function (id) {
        $location.path('/master/statistics/share/share_detail/' + id);
        console.log(id);
    };
});

statisticsCtrl.controller('ShareDetailCtrl', function ($http, $scope,$state, $rootScope,$stateParams, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "uid":$stateParams.id
        };
        console.log(m_params);
        $http({
            url: api_uri + "wxShare/manager/customerApplyList",
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
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            // $location.path("/error");
        })
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
    $scope.ids=[];
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log($scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
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
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/cancelCustomer",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log(data);
                    $scope.ids=[];
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});
