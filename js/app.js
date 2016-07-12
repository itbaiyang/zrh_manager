

//api_uri = "http://123.206.84.74/api/";
//api_uri = "http://api.supeiyunjing.com/";
api_uri = "http://172.17.2.13:8080/api/";
var templates_root = 'templates/';
deskey = "abc123.*abc123.*abc123.*abc123.*";
var app = angular.module('app', [
    'ng',
    'ngRoute',
    'ngAnimate',
    'ui.router',

    'tm.pagination',
    'loginCtrl',
    'topBarCtrl',
    'loanApplicationCtrl',
    'productCtrl',
    'personBjCtrl',
    'superCtrl',

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

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

});


app.run(function ($location, $rootScope, $http) {

    /*********************************** 回调区 ***************************************/
        // 页面跳转后
    $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";
 /*   $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        var present_route = $location.$$path; //获取当前路由
        $(".alertBox").css("height", $(document).height());
        $(".alertBa").css("height", $(window).height());
        $(".autoMargin2").css("margin-top", $(document).scrollTop() - "192");
    });
    // 页面跳转前
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

    });
*/
    /*********************************** 公用方法区 ***************************************/

        //加密 3des
    $rootScope.encryptByDES = function (message) {
        var keyHex = CryptoJS.enc.Utf8.parse(deskey);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
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
    //{"userId":"ffc41f5e8b96471aba063370826b1a87","token":"9794e4063b94a357be401fa2faed59683a4d79af"}
    /*正式服务器*/
    //$rootScope.userId = 'ffc41f5e8b96471aba063370826b1a87';
    //$rootScope.token = '45d2a5274cf357c829414a67acf0df287375414f';
    /*本地服务器*/
    //$rootScope.userId = 'ffc41f5e8b96471aba063370826b1a87';
    //$rootScope.token = '9794e4063b94a357be401fa2faed59683a4d79af';
    /*测试服务器*/
    //$rootScope.userId = '51ff64fed0fe48d4969692465c8503f0';
    //$rootScope.token = '0ad89585b7b9fb8b4281ebbf207fe7752b788b87';
    /*测试服务器*/
    //$rootScope.userId = '8ca9a4a13e5e45108728395accdc2df3';
    //$rootScope.token = 'd111139017fac0614769a43787fc5a6268f7dd8a';

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

})
