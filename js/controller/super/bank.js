var bankCtrl = angular.module('bankCtrl', []);
bankCtrl.controller('BankCtrl', function ($http, $scope, $state, $rootScope, $location) {

    /*获取银行列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "manage/bank/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.bank_list = d.result.datas;
            }
            else {
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };

    $scope.list(1, 100);

    /*编辑银行*/
    $scope.edit_bank = function (id) {
        $location.path('/super/bank/update/' + id);
    };

    /*删除银行*/
    $scope.delete = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            id: id
        };
        $http({
            url: api_uri + "manage/bank/delete",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.list(1, 20);
            }
            else {
            }
        }).error(function (d) {
        });
    };

    /*查看银行职员列表*/
    $scope.find_detail = function (id, name) {
        $state.go("super.bank.bank_man", {id: id, name: name});
    };
});

bankCtrl.controller('BankManCtrl', function ($http, $scope, $rootScope, $location, $stateParams, $state) {

    /*初始化参数*/
    $scope.selected = [];
    
    $scope.ids = [];
    
    $scope.id = $stateParams.id;
    
    $scope.bankName = $stateParams.name;

    /*获取银行职员列表*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "bankId": $stateParams.id,
        };
        $http({
            url: api_uri + "manage/bank/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.bank_man_list = d.result.datas;
            }
            else {
            }
        }).error(function (d) {
        })
    };

    $scope.list(1, 20);

    /*分页显示*/
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    /*是否被选中*/
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
    };

    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    /*删除银行职员*/
    $scope.delete = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids,
            "bankId": $scope.id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                    //console.log(data);
                }
            },
            error: function (data, textStatus, jqXHR) {
                //console.log(data)
            },
            dataType: 'json',
        });
    };

    $scope.delete_one = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "ids": id,
            "bankId": $scope.id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                }
            },
            error: function (data, textStatus, jqXHR) {
            },
            dataType: 'json',
        });
    };

    /*跳转页面*/
    $scope.add_user = function (id, name) {
        $state.go("super.bank.add_bank_man", {id: id, name: name});
    };

    $scope.edit_bank_man = function (id, name) {
        $state.go("super.bank.update_bank_man", {id: id, name: name});
    };
    
});

bankCtrl.controller('AddBankCtrl', function ($http, $scope, $rootScope, $state) {

    /*初始化图片*/
    $scope.init = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token
        };
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
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
                            //console.log(file_url);
                            $scope.bankPic = file_url;
                            $scope.$apply();
                            m_params.key = "bankPic";
                            m_params.value = $scope.bankPic;
                        },
                        'Error': function (up, err, errTip) {
                            //console.log(err);
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
            }
        }).error(function (d) {
        });
    };
    $scope.init();

    /*提交添加银行*/
    $scope.submitAdd = function () {
        $scope.feature_list_new = [];
        $scope.condition_list_new = [];
        for (var key in $scope.feature_list) {
            $scope.feature_list_new.push($scope.feature_list[key].feature)
        }
        for (var key in $scope.condition_list) {
            $scope.condition_list_new.push($scope.condition_list[key].condition)
        }
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.name,
            "icon": $scope.bankPic,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/add",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                if (data.returnCode == 0) {
                    $state.go("super.bank");
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };
});

bankCtrl.controller('UpdateBankCtrl', function ($http, $scope, $rootScope, $state, $stateParams) {

    /*获取银行信息*/
    $scope.detail = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "manage/bank/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.bankEdit = "编辑银行";
                $scope.bank = d.result;
                $scope.name = d.result.name;
                $scope.bankPic = d.result.icon;
            }
            else {
            }
        }).error(function (d) {
        })
    };
    $scope.detail();

    /*初始化图片*/
    $scope.init = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
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
                            //console.log(file_url);
                            $scope.bankPic = file_url;
                            $scope.$apply();
                            m_params.key = "bankPic";
                            m_params.value = $scope.bankPic;
                            //$.post(api_uri + "manage/bank/add", m_params,
                            //    function (data) {
                            //        if (data.returnCode == 0) {
                            //            console.log('wodetian')
                            //        } else {
                            //            console.log(data);
                            //        }
                            //    },
                            //    "json");
                        },
                        'Error': function (up, err, errTip) {
                            //console.log(err);
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
                //console.log(d);
            }
        }).error(function (d) {
            //console.log(d);
        });
    };
    $scope.init();

    /*更新银行数据*/
    $scope.update = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.name,
            "icon": $scope.bankPic,
            "id": id
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/update/" + $stateParams.id,
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    ;
                    $state.go("super.bank");
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json'
        });
    };
});

bankCtrl.controller('AddBankManCtrl', function ($http, $scope, $rootScope, $state, $stateParams, $location, $timeout) {

    $scope.selected = [];
    $scope.ids = [];
    $scope.names = [];

    /*获取该银行金融产品*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "bankId": $stateParams.id,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "release": true
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.product_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.list(1, 100);

    /*是否被选中*/
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id, name) {
        if (action == 'add') {
            $scope.ids.push(id);
            $scope.names.push(name);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            var name_x = $scope.names.indexOf(name);
            $scope.ids.splice(idx, 1);
            $scope.names.splice(name_x, 1);
        }
    };

    $scope.updateSelection = function ($event, id, name) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, name);
    };

    /*添加银行职员*/
    $scope.add_bank_man = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.bank_man.name,
            "bankId": $stateParams.id,
            "branchBankName": $scope.bank_man.branchBankName,
            "address": $scope.bank_man.address,
            "position": $scope.bank_man.position,
            "productIds": $scope.ids,
            "mobile": $scope.bank_man.mobile,
            "email": $scope.bank_man.email,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/add",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $state.go("super.bank.bank_man", {id: m_params.bankId});
                    $scope.$apply();
                }
                else {
                    //console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    /*返回上一级页面*/
    $scope.go_back = function () {
        window.history.go(-1);
    };

    /*显示金融产品框*/
    $scope.show_product = function () {
        $scope.productDiv = true;
    };

    /*隐藏金融产品框*/
    $scope.hide_product = function () {
        $scope.products = "";
        for (var i = 0; i < $scope.names.length; i++) {
            $scope.products += $scope.names[i];
            $scope.products += " ";
        }
        ;
        $scope.productDiv = false;
    }
});

bankCtrl.controller('UpdateBankManCtrl', function ($http, $scope, $rootScope, $state, $stateParams, $location, $timeout) {
    /*初始化参数*/
    $scope.selected = [];
    $scope.ids = [];
    $scope.names = [];
    /*获取银行职员信息*/
    $scope.detail = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "manage/bank/user/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $scope.bank_man = d.result;
                $scope.bank_man_title = "修改银行职员";
                $scope.products = "";
                $scope.list(1, 100);
            }
            else {
            }
        }).error(function (d) {
        })
    };
    $scope.detail();

    /*获取金融产品*/
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "bankId": $scope.bank_man.bankId,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "release": true
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.product_list = d.result.datas;
                for (var i = 0; i < $scope.bank_man.productIds.length; i++) {
                    for (var j = 0; j < $scope.product_list.length; j++) {
                        if ($scope.bank_man.productIds[i] == $scope.product_list[j].id) {
                            $scope.names.push($scope.product_list[j].name);
                            $scope.ids.push($scope.product_list[j].id);
                        }
                    }
                }
                $scope.products = "";
                for (var i = 0; i < $scope.names.length; i++) {
                    $scope.products += $scope.names[i];
                    $scope.products += " ";
                }
                // console.log($scope.product_list);
                // console.log($scope.bank_man.productIds);
                // console.log($scope.names);
                // console.log($scope.products);
            }
            else {
                //console.log(d.result);
            }
        }).error(function (d) {
        })
    };
    /*是否被选中*/
    $scope.isSelected = function (id) {
        return $scope.bank_man.productIds.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id, name) {
        if (action == 'add') {
            $scope.ids.push(id);
            $scope.names.push(name);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            var name_x = $scope.names.indexOf(name);
            $scope.ids.splice(idx, 1);
            $scope.names.splice(name_x, 1);
        }
    };

    $scope.updateSelection = function ($event, id, name) {
        //console.log("点击一下");
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, name);
    };

    /*更新银行职员信息*/
    $scope.add_bank_man = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.bank_man.name,
            "bankId": $scope.bank_man.bankId,
            "branchBankName": $scope.bank_man.branchBankName,
            "address": $scope.bank_man.address,
            "position": $scope.bank_man.position,
            "productIds": $scope.ids,
            "mobile": $scope.bank_man.mobile,
            "email": $scope.bank_man.email,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/update/" + $stateParams.id,
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $state.go("super.bank.bank_man", {id: m_params.bankId});
                    $scope.$apply();

                }
                else {
                    //console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    /*显示，隐藏产品框*/
    $scope.show_product = function () {
        $scope.productDiv = true;
    };

    $scope.hide_product = function () {
        $scope.products = "";
        for (var i = 0; i < $scope.names.length; i++) {
            $scope.products += $scope.names[i];
            $scope.products += " ";
        }
        $scope.productDiv = false;
    };

    /*返回上一级页面*/
    $scope.go_back = function () {
        window.history.go(-1);
    }
});