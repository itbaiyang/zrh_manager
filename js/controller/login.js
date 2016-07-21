var loginCtrl = angular.module('loginCtrl', []);
loginCtrl.controller('LoginCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams) {
    var getTimestampTemp=new Date().getTime();
    var timestamp=String(getTimestampTemp).substring(0,10);
    var getTimestamp=parseInt(timestamp);
    $scope.loginUser = {
        "account": "",
        "password": "",
        "timestamp":getTimestamp
    };

    $scope.error_code_msg = {
        1003:"该用户不存在",
        2001:"用户名或密码错误",
        1002:"该用户异常",
        1:"服务器异常,请稍后再试"
    };

    var check_params = function (params) {
        if (params.account == "" || params.password == "") {
            return false;
        }
        return true;
    };

    $scope.login = function () {
        $scope.loginUser.signature = $rootScope.encryptByDES($scope.loginUser.password+$scope.loginUser.timestamp);
        var m_params = $scope.loginUser;
        console.log($scope.loginUser);
        if (!check_params(m_params)) return;
        $http({
            url: api_uri+"p/user/login",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $rootScope.login_user = {
                    "userId":d.result.split("_")[0],
                    "token":d.result.split("_")[1],
                };
                $rootScope.putObject("login_user", $rootScope.login_user);
                $scope.choiceUser();
                //$location.path("/super");
            }else {
                console.log(d);
            }

        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
    $scope.choiceUser = function(){
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
        };
        $http({
            url: api_uri+"p/user/detail/"+login_user.userId,
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                if(d.result.role == 'super'){
                    $location.path("/super");
                }else{
                    $location.path("/master");
                }
            }else {
                console.log(d);
                var msg = $scope.error_code_msg[d.returnCode];
                 if(!msg){
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
    $scope.reset = function(){
        //$location.path("/");
    };
});