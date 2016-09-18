// api_uri = "http://test.zhironghao.com/api/";
api_uri = "http://api.supeiyunjing.com/";
//api_uri = "http://172.17.2.13:8080/api/";
// api_uri = "http://172.16.97.229:8080/api/";
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
                    && from_route.indexOf('admin.my_project.apply_again') <= -1
                    && from_route.indexOf('admin.my_project.distribute') <= -1
                    && from_route.indexOf('admin.my_project.apply_help') <= -1
                    && from_route.indexOf('admin.my_project.choice_sale') <= -1) {
                    $rootScope.putSessionObject('from_route',from_route);
                    var get_route = $rootScope.getSessionObject('from_route');
                    // console.log(get_route);
                    if (get_route == "admin.company_message") {
                        $rootScope.showBtn = 1;
                        // console.log($rootScope.showBtn);
                    } else {
                        $rootScope.showBtn = 2;
                        // console.log($rootScope.showBtn);
                    }
                    if(fromParams.id){
                        var arrayParams = from_route.split(".");
                        var from_route2 = "/" + arrayParams[0] + "/" + arrayParams[1] + "/" + arrayParams[2] + "/";
                        if(arrayParams[2] != 'edit_apply'){
                        $rootScope.putSessionObject('from_route2',from_route2);
                        }
                        var from_params= fromParams.id;
                        // console.log(from_params);
                        $rootScope.putSessionObject('from_params',from_params);

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

    $rootScope.transFn = function(obj) {
        var str = [];
        for(var p in obj){
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
                console.log($rootScope.role);
                if ($rootScope.role == 'super') {
                    if ($rootScope.arrayParams[0] == 'super') {
                    } else {
                        $location.path("/login");
                    }
                } else if ($rootScope.role == 'admin') {
                    if ($rootScope.arrayParams[0] == 'admin') {
                        if ($rootScope.arrayParams[1] == 'user_list') {
                            // $location.path("/login");
                        } else {
                        }
                    } else {
                        // $location.path("/login");
                    }
                } else if ($rootScope.role == 'manager') {
                    if ($rootScope.arrayParams[0] == 'admin') {
                    } else {
                        // $location.path("/login");
                        console.log("lll")
                    }
                }
            } else {
            }

        }).error(function (d) {
        })
    };
});