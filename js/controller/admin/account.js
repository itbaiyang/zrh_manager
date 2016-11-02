var accountCtrl = angular.module('accountCtrl', []);
accountCtrl.controller('AccountCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {
        $scope.role_manage = $rootScope.getObject("role_manage");
    }]);
accountCtrl.controller('PasswordCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$stateParams', function ($http, $scope, $state, $rootScope, $stateParams) {
        $scope.step = $stateParams.step;
        $scope.submit = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "pd": $scope.password
            };
            console.log(m_params);
            $http({
                url: api_uri + "p/user/updatePwd",
                method: "POST",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $rootScope.successMsg = "修改成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $state.go('admin.account.password', {step: 3});
                    $rootScope.removeObject('login_user_manage')
                } else {
                }

            }).error(function (d) {
            })
        };
        $scope.go_login = function () {
            $state.go('login')
        }
    }]);