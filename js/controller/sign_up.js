/**
 * Created by baiyang on 2016/7/11.
 */
var signUpCtrl = angular.module('signUpCtrl', []);
signUpCtrl.controller('SignUpCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    //$scope.$root.title = "登陆";
    $scope.loginUser = {
        "username": "",
        "password": ""
    };

    var check_params = function (params) {
        if (params.username == "" || params.password == "") {
            return false;
        }
        return true;
    };
    $scope.login = function () {
        var m_params = $scope.loginUser;
        if (!check_params(m_params)) return;
        $http({
            url: api_uri+"auth/web",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $rootScope.login_user = {
                    "userId":d.result.split("_")[0],
                    "token":d.result.split("_")[1]
                }
                $rootScope.putObject("login_user", $rootScope.login_user);
                $location.path("/master");
            }else {
                /*var msg = $scope.error_code_msg[d.returnCode];
                 if(!msg){
                 msg = "登录失败";
                 }
                 $scope.error_msg = msg;
                 //$scope.changeErrorMsg(msg);*/
            }

        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
    $scope.reset = function(){
        //$location.path("/");
    };
});