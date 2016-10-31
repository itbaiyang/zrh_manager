var accountCtrl = angular.module('accountCtrl', []);
accountCtrl.controller('AccountCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {
        $scope.role_manage = $rootScope.getObject("role_manage");
        console.log($scope.role_manage);
    }]);
accountCtrl.controller('PasswordCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$stateParams', function ($http, $scope, $state, $rootScope, $stateParams) {
        var timesTamp = new Date().getTime();
        var timesTamp1 = String(timesTamp).substring(0, 10);
        $scope.timestamp = parseInt(timesTamp1);
        $scope.submit = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "pd": $scope.password,
            };
            console.log(m_params);
            $http({
                url: api_uri + "p/user/updatePwd",
                method: "POST",
                params: m_params
            }).success(function (d) {
                console.log(d)
                if (d.returnCode == 0) {
                    $rootScope.successMsg = "修改成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $state.go('admin.account');
                } else {
                }

            }).error(function (d) {
            })
        };
        $scope.go_login = function () {
            $state.go('login')
        }
    }]);