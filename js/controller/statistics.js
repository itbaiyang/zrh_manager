var statisticsCtrl = angular.module('statisticsCtrl', []);
statisticsCtrl.controller('StatisticsCtrl', function ($http, $scope,$state, $rootScope, $location, $routeParams) {

});

statisticsCtrl.controller('PersonCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            // "wd": wd,
            // "shareId": shareId,
        };
        $http({
            url: api_uri + "wxShare/manager/urlList",
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

    $scope.list(1, 20);

    // $scope.list_product = function (pageNo, pageSize) {
    //     var login_user = $rootScope.getObject("login_user");
    //     var m_params = {
    //         "userId":login_user.userId,
    //         "token":login_user.token,
    //         "pageNo": pageNo,
    //         "pageSize": pageSize,
    //         "wd": $scope.wd,
    //         "release": $scope.release_status
    //     };
    //     $http({
    //         url: api_uri + "financialProductManage/list",
    //         method: "GET",
    //         params: m_params
    //     }).success(function (d) {
    //         console.log(d);
    //         if (d.returnCode == 0) {
    //             $scope.page = d.result;
    //             $scope.result_list = d.result.datas;
    //             angular.forEach($scope.result_list, function (data) {
    //                 if (!data.release) {
    //                     data.progressText = "未发布";
    //
    //                 } else {
    //                     data.progressText = "已发布";
    //                 }
    //             });
    //         }
    //         else {
    //             console.log(d.result);
    //         }
    //
    //     }).error(function (d) {
    //         console.log("login error");
    //         $location.path("/error");
    //     })
    // };
    //
    // $scope.list_product(1, 1000);

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

    $scope.refresh = function(){
        $scope.list($scope.pageNo1, 10);
    };
});

statisticsCtrl.controller('ChannelCtrl', function ($http, $scope,$state, $rootScope, $location, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            // "wd": wd,
            // "shareId": shareId,
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

    $scope.refresh = function(){
        $scope.list($scope.pageNo1, 10);
    };
});