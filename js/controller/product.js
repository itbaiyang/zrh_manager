/**
 * Created by baiyang on 2016/7/7.
 */
var productCtrl = angular.module('productCtrl', []);
productCtrl.controller('ProductCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    var result_list = [];
    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
                angular.forEach($scope.result_list, function (data) {
                    if (!data.release) {
                        data.progressText = "未发布";

                    } else {
                        data.progressText = "已发布";
                    }
                });
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
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
    }
    //$scope.search = function () {
    //    // console.log("search");
    //
    //    $scope.wd = $scope.search_text;
    //
    //    get_company_list_page(1, 20);
    //};

    $scope.submit = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/release",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.cancel = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/unRelease",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    $scope.delete = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    $scope.update = function(id){
        //$location.state('master.product.update');
        $location.path('/master/product/update/' + id);
        console.log(id);
    };

    $scope.release = function (id) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/release",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    $scope.unrelease = function (id) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/unRelease",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

});

productCtrl.controller('ProductCreateCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.feature_list = [{"feature":""}];
    $scope.add_feature = function () {
        $scope.feature_list.push({
            "feature":""
        });
        console.log($scope.feature_list);
    };
    $scope.remove_feature = function (feature) {
        for (var key in $scope.feature_list) {
            if ($scope.feature_list[key] == feature) {
                $scope.feature_list.splice(key, 1);
                break;
            }
        }
    };
    $scope.condition_list = [{"condition":""}];
    $scope.add_condition = function () {
        $scope.condition_list.push({
            "condition":""
        });
    };
    console.log($scope.condition_list);
    $scope.remove_condition = function (condition) {
        for (var key in $scope.condition_list) {
            if ($scope.condition_list[key] == condition) {
                $scope.condition_list.splice(key, 1);
                break;
            }
        }
    };

    $scope.init = function(){
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
        };
        //$scope.feature_list = [];
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(m_params);
            console.log(d);
            if (d.returnCode == 0) {
                $scope.qiniu_token = d.result.uptoken;
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                    uptoken: $scope.qiniu_token,
                    //	        get_new_uptoken: true,
                    //save_key: true,
                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                    container: 'upload_container',           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '10mb',           //最大文件体积限制
                    flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: false,                   //开启可拖曳上传
                    drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function (up, files) {
                            //                    plupload.each(files, function(file) {
                            //                        // 文件添加进队列后,处理相关的事情
                            //                    });
                        },
                        'BeforeUpload': function (up, file) {
                            $rootScope.uploading = true;
                            $scope.upload_percent = file.percent;
                            $rootScope.$apply();
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                            $scope.upload_percent = file.percent;
                            $scope.$apply();
                        },
                        'FileUploaded': function (up, file, info) {
                            var res = $.parseJSON(info);
                            var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                            console.log(file_url);
                            $scope.bankPic = file_url;
                            $scope.$apply();
                            m_params.key = "bankPic";
                            m_params.value = $scope.bankPic;
                            $.post(api_uri + "financialProductManage/create", m_params,
                                function (data) {
                                    if (data.returnCode == 0) {
                                        console.log('wodetian')
                                    } else {
                                        console.log(data);
                                    }
                                },
                                "json");
                        },
                        'Error': function (up, err, errTip) {
                            console.log(err);
                            $rootScope.alert("营业执照上传失败！");
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function (up, file) {
                            var time = new Date().getTime();
                            var k = 'financialProductManage/create/' + m_params.userId + '/' + time;
                            return k;
                        }
                    }
                });
            } else {
                console.log(d);
            }

        }).error(function (d) {
            console.log(d);
        });
    }
    $scope.init();

    $scope.submit = function () {
        $scope.feature_list_new = [];
        $scope.condition_list_new = [];
        for (var key in $scope.feature_list) {
            console.log($scope.feature_list[key].feature)
            $scope.feature_list_new.push($scope.feature_list[key].feature)
        }
        for (var key in $scope.condition_list) {
            console.log($scope.condition_list[key].condition)
            $scope.condition_list_new.push($scope.condition_list[key].condition)
        }
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            "name": $scope.product.name,
            "summary": $scope.product.summary,
            "ratecap": $scope.product.ratecap,
            "ratefloor": $scope.product.ratefloor,
            "loanvalue": $scope.product.loanvalue,
            "loanlife": $scope.product.loanlife,
            "bankname": $scope.product.bankname,
            "feature": $scope.feature_list_new,
            "conditions": $scope.condition_list_new,
            "icon": $scope.bankPic,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("创建成功了");
                    $location.path('/product');
                    $scope.$apply();

                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});

productCtrl.controller('ProductUpdateCtrl', function ($http, $scope, $state, $rootScope, $location, $stateParams, $timeout, $routeParams) {
    $scope.feature_list = [];
    $scope.add_feature = function () {
        $scope.feature_list.push({
            "feature":""
        });
        console.log($scope.feature_list);
    };
    $scope.remove_feature = function (feature) {
        for (var key in $scope.feature_list) {
            if ($scope.feature_list[key] == feature) {
                $scope.feature_list.splice(key, 1);
                break;
            }
        }
    };
    $scope.condition_list = [];
    $scope.add_condition = function () {
        $scope.condition_list.push({
            "condition":""
        });
    };
    console.log($scope.condition_list);
    $scope.remove_condition = function (condition) {
        for (var key in $scope.condition_list) {
            if ($scope.condition_list[key] == condition) {
                $scope.condition_list.splice(key, 1);
                break;
            }
        }
    };
    var login_user = $rootScope.getObject("login_user");
    var m_params = {
        "userId":login_user.userId,
        "token":login_user.token,
    };
    $scope.init = function(){
        //$scope.feature_list = [];
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.qiniu_token = d.result.uptoken;
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                    uptoken: $scope.qiniu_token,
                    //	        get_new_uptoken: true,
                    //save_key: true,
                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                    container: 'upload_container',           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '10mb',           //最大文件体积限制
                    flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: false,                   //开启可拖曳上传
                    drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function (up, files) {
                            //                    plupload.each(files, function(file) {
                            //                        // 文件添加进队列后,处理相关的事情
                            //                    });
                        },
                        'BeforeUpload': function (up, file) {
                            $rootScope.uploading = true;
                            $scope.upload_percent = file.percent;
                            $rootScope.$apply();
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                            $scope.upload_percent = file.percent;
                            $scope.$apply();
                        },
                        'FileUploaded': function (up, file, info) {
                            var res = $.parseJSON(info);
                            var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                            console.log(file_url);
                            $scope.product.icon = file_url;
                            $scope.$apply();
                            m_params.key = "bankPic";
                            m_params.icon = $scope.product.icon;
                            $.post(api_uri + "financialProductManage/update", m_params,
                                function (data) {
                                    if (data.returnCode == 0) {
                                        console.log('wodetian')
                                    } else {
                                        console.log(data);
                                    }
                                },
                                "json");
                        },
                        'Error': function (up, err, errTip) {
                            console.log(err);
                            $rootScope.alert("营业执照上传失败！");
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function (up, file) {
                            var time = new Date().getTime();
                            var k = 'financialProductManage/update/' + m_params.userId + '/' + time;
                            return k;
                        }
                    }
                });
            } else {
                console.log(d);
            }

        }).error(function (d) {
            console.log(d);
        });
    }
    $scope.init();
    $scope.get = function(){
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
        };
        $http({
            url: api_uri + "financialProductManage/detail/"+$stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            console.log(d.result.conditions,'123');
            $scope.product = d.result;
            for (var key in d.result.feature) {
                $scope.feature_list.push({"feature": d.result.feature[key]});
            }
            for (var key in d.result.conditions) {
                $scope.condition_list.push({"condition": d.result.conditions[key]});
            }
        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        })
    };
    $scope.get();
    $scope.submit = function () {
        $scope.feature_list_new = [];
        $scope.condition_list_new = [];
        for (var key in $scope.feature_list) {
            console.log($scope.feature_list[key].feature)
            $scope.feature_list_new.push($scope.feature_list[key].feature)
        }
        for (var key in $scope.condition_list) {
            console.log($scope.condition_list[key].condition)
            $scope.condition_list_new.push($scope.condition_list[key].condition)
        }
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "id":$stateParams.id,
            "userId": login_user.userId,
            "token": login_user.token,
            "name": $scope.product.name,
            "summary": $scope.product.summary,
            "ratecap": $scope.product.ratecap,
            "ratefloor": $scope.product.ratefloor,
            "loanvalue": $scope.product.loanvalue,
            "loanlife": $scope.product.loanlife,
            "bankname": $scope.product.bankname,
            "feature": $scope.feature_list_new,
            "conditions": $scope.condition_list_new,
            "icon": $scope.product.icon,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "financialProductManage/update",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("创建成功了");
                    //$location.path("/" + $rootScope.getAccountInfoKeyValue('account') + "/product");
                    //$location.path('../../product');
                    //$location.state('master.product','/product');
                    $state.go('master.product');
                    $scope.$apply();


                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});