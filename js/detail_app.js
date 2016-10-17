api_uri = "http://test.zhironghao.com/api/";
// api_uri = "http://api.supeiyunjing.com/";
// api_uri = "http://172.17.2.13:8080/api/";
// api_uri = "http://172.16.97.229:8080/api/";
var templates_root = 'templates/';
deskey = "abc123.*abc123.*abc123.*abc123.*";
var detail_app = angular.module('detail_app', [
    'ng',
    'ngRoute',
    'ngAnimate',
    'ui.router',

    'detailAppCtrl',
    // 'topBarCtrl',
    // 'applyListCtrl',
    // 'loanApplicationCtrl',
    // 'productCtrl',
    // 'myProjectCtrl',
    // 'saleManagerCtrl',
    // 'manageCtrl',
    // 'teamCtrl',
    // 'signUpCtrl',
    // 'bankCtrl',
    // 'channelCtrl',
    // 'shareCtrl',
    // // 'accountCtrl',
    // 'messageCtrl',

], function ($httpProvider) {
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


detail_app.run(function ($location, $rootScope, $timeout, $http) {

    /*********************************** 回调区 ***************************************/
    // 页面跳转后
    $rootScope.isOpenMenu = true;
    $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {

        });
    // 页面跳转前
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

        });
    /*********************************** 公用方法区 ***************************************/
    $rootScope.fadeInOut = function (elem, speed) {
        $(elem).fadeIn(speed);
        setTimeout(function () {
            $(elem).fadeOut(speed);
        }, 3000);
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

    $rootScope.login_user = $rootScope.getObject("login_user");
});
