var companyCtrl = angular.module('companyCtrl', []);
companyCtrl.controller('CompanyCtrl',
    ['$scope', '$state', '$rootScope', '$http', '$stateParams', function ($scope, $state, $rootScope, $http, $stateParams) {
        $scope.pageNo1 = $stateParams.page;
        if ($stateParams.wd) {
            $scope.search_text = decodeURI($stateParams.wd);
            $scope.wd = decodeURI($stateParams.wd);
        } else {
            $scope.search_text = null;
        }
        // $scope.wd = decodeURI($stateParams.wd);
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd
        };
        console.log(m_params);
        $http({
            url: api_uri + "company/query/pageCompanyName",
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
        })
    };
        $scope.list($stateParams.page, 20);
        $scope.changePage = function (page) {
            $scope.pageNo1 = page;
            $state.go('super.company', {
                'page': page,
                'wd': $scope.search_text
            });
        };

        $scope.search = function () {
            $scope.wd = $scope.search_text;
            $state.go('super.company', {
                'page': 1,
                'wd': $scope.search_text
            });
        };
}]);

companyCtrl.controller('CompanyDetailCtrl',
    ['$scope', '$rootScope', '$http', '$stateParams', function ($scope, $rootScope, $http, $stateParams) {
        // $scope.id = $stateParams.id;
        console.log($stateParams.id);
        $scope.detail = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "companyId": $stateParams.id
            };
            $http({
                url: api_uri + "company/query/byCompanyId",
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.companyName = d.result.companyName;
                    $scope.gongshangInfo = d.result.gongshangInfo; //工商信息
                    $scope.shuiwuInfo = d.result.shuiwuInfo; //税务信息
                    $scope.zibenInfo = d.result.zibenInfo; //资本信息
                    $scope.zhuyaorenyuanInfo = d.result.zhuyaorenyuanInfo; //主要人员
                    $scope.touzirenInfo = d.result.touzirenInfo; //投资人
                    $scope.zaitouziInfo = d.result.zaitouziInfo; //再投资
                    $scope.chuzilishiInfo = d.result.chuzilishiInfo; // 出资历史
                    $scope.qiyenianbaoInfo = d.result.qiyenianbaoInfo; //企业年报
                    $scope.jobInfo = d.result.jobInfo; //招聘信息
                    $scope.zzjgdmInfo = d.result.zzjgdmInfo; //组织机构代码
                }
                else {

                }
            }).error(function (d) {
                console.log(d);
            })
        };
        $scope.detail()
}]);