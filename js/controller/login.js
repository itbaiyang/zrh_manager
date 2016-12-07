var loginCtrl = angular.module('loginCtrl', []);
loginCtrl.controller('LoginCtrl',
    ['$scope', '$rootScope', '$http', '$state', '$location', function ($scope, $rootScope, $http, $state, $location) {
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
        if (!check_params(m_params)) return;
        $http({
            url: api_uri + "p/user/login",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $rootScope.login_user = {
                    "userId": d.result.split("_")[0],
                    "token": d.result.split("_")[1],
                };
                $rootScope.putObject("login_user_manage", $rootScope.login_user);
                $scope.choiceUser();
                $scope.loginUser = {
                    "account": "",
                    "password": "",
                    "timestamp": getTimestamp
                };
            } else {
                console.log(d);
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
                $rootScope.putObject("role_manage", d.result);
                if (d.result.role == 'super') {
                    // $state.go('super.company', {page: 1, wd: ""});
                    $location.path("/super/company/1/");
                } else {
                    $location.path("/admin");
                }
            } else {
                console.log(d);
                var msg = $scope.error_code_msg[d.returnCode];
                if (!msg) {
                    msg = "登录失败";
                }
                $scope.error_msg = msg;
            }
        }).error(function (d) {
        })
    };
}]);

loginCtrl.controller('ForgetPasswordCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$stateParams', function ($http, $scope, $state, $rootScope, $stateParams) {
        $scope.step = 1;
        $scope.phoneNumCheck = false;
        $scope.check_account = function () {
            var m_params = {
                "account": $scope.account
            };
            $http({
                url: api_uri + "p/user/getTokenByAccount",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.mobile_return = d.result.mobile;
                    $scope.phoneNumCheck = true;
                    $scope.token = d.result.token;
                    return true;
                } else if (d.returnCode == 1003) {
                    alert("该用户不存在，重新输入邮箱");
                } else {
                    alert('未知错误');
                }
            }).error(function (d) {
            });
        };

        $scope.check_phone = function () {
            var m_params = {
                "token": $scope.token,
                "mobile": $scope.mobile
            };
            $http({
                url: api_uri + "p/user/validateMobile",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.send_code()
                } else if (d.returnCode == 1003) {
                    alert('用户不存在或参数错误');
                } else if (d.returnCode == 1004) {
                    alert('手机号码错误');
                } else {
                    alert('未知错误');
                }
            }).error(function (d) {
            });
        };

        $scope.send_code = function () {
            var m_params = {
                "token": $scope.token
            };
            $http({
                url: api_uri + "p/user/sendSms",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {

                } else if (d.returnCode == 1003) {
                    alert('用户不存在或参数错误');
                } else if (d.returnCode == 1004) {
                    alert('手机号码错误');
                } else if (d.returnCode == 3002) {
                    alert('短信发送失败');
                } else if (d.returnCode == 3003) {
                    alert('短信发送过于频繁');
                } else {
                    alert('未知错误');
                }
            }).error(function (d) {
            });
        };

        $scope.check_code = function () {
            var m_params = {
                "token": $scope.token,
                code: $scope.code
            };
            $http({
                url: api_uri + "p/user/validateSmsCode",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.step = 2;
                } else if (d.returnCode == 1003) {
                    alert('用户不存在或参数错误');
                } else {
                    alert('未知错误');
                }
            }).error(function (d) {
            });
        };

        $scope.submit = function () {
            var m_params = {
                "token": $scope.token,
                "pwd": $scope.pwd,
                "password": $scope.password
            };
            $http({
                url: api_uri + "p/user/resetPwd ",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.step = 3
                } else {
                }

            }).error(function (d) {
            })
        };
        $scope.go_login = function () {
            $state.go('login')
        }
    }]);