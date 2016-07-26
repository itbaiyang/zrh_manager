var bankCtrl = angular.module('bankCtrl', []);
bankCtrl.controller('BankCtrl', function ($http, $scope, $state, $rootScope, $location, $timeout, $routeParams) {
    $scope.selected = [];
    $scope.ids = [];
    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
        };
        $http({
            url: api_uri + "manage/bank/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.bank_list = d.result.datas;
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

    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    $scope.edit_bank = function (id) {
        $location.path('/master/bank/update/' + id);
    };

    $scope.find_detail = function (id, name) {
        $state.go("master.bank.bank_man", {id: id, name: name});
    }

    $scope.delete = function (id) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            id: id
        };
        console.log(m_params);
        $http({
            url: api_uri + "manage/bank/delete",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.list(1, 20);
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
        });
    };

    $scope.changeModule = function (a, b) {
        $scope.editModule = a;
        $scope.deleteModule = b;
    }

});

bankCtrl.controller('BankManCtrl', function ($http, $scope, $rootScope, $location, $stateParams, $state, $routeParams, $timeout) {

    $scope.selected = [];
    $scope.ids = [];
    $scope.id = $stateParams.id;
    $scope.bankName = $stateParams.name;
    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "bankId": $stateParams.id,
            //"wd":$scope.wd
        };
        $http({
            url: api_uri + "manage/bank/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.bank_man_list = d.result.datas;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
        })
    };

    $scope.list(1, 20);

    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

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
    };

    $scope.add_user = function (id, name) {
        console.log(id);
        console.log(name);
        $state.go("master.bank.add_bank_man", {id: id, name: name});
    };

    $scope.delete = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids,
            "bankId": $scope.id
        };
        console.log($scope.ids);
        console.log("baiyang", m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                    console.log(data);
                }
            },
            error: function (data, textStatus, jqXHR) {
                console.log(data)
            },
            dataType: 'json',
        });
    };

    //$scope.search_text = null;
    //$scope.search = function () {
    //    $scope.wd = $scope.search_text;
    //    $scope.list(1, 20);
    //};
});

bankCtrl.controller('AddBankCtrl', function ($http, $scope, $rootScope, $state, $location, $timeout, $routeParams) {
    $scope.init = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
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

    $scope.submitAdd = function () {
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
            "userId": login_user.userId,
            "token": login_user.token,
            "name": $scope.name,
            "icon": $scope.bankPic,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/add",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("创建成功了");
                    $state.go("master.bank");
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

bankCtrl.controller('UpdateBankCtrl', function ($http, $scope, $rootScope, $state, $stateParams, $location, $timeout, $routeParams) {
    console.log($stateParams.id);
    $scope.detail = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
        };
        $http({
            url: api_uri + "manage/bank/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.bank = d.result;
                $scope.name = d.result.name;
                $scope.bankPic = d.result.icon;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
        })
    };
    $scope.detail();
    $scope.init = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
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

    $scope.update = function (id) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "name": $scope.name,
            "icon": $scope.bankPic,
            "id": id
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "manage/bank/update/" + $stateParams.id,
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("编辑成功");
                    $state.go("master.bank");
                    $scope.$apply();

                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json'
        });
    };
});

bankCtrl.controller('AddBankManCtrl', function ($http, $scope, $rootScope, $state, $stateParams, $location, $timeout) {

    $scope.bankName = $stateParams.name;

    $scope.add_bank_man = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            "bankId": $stateParams.id,
            "name": $scope.bank_man.name,
            //"bankName": $stateParams.bankName,
            //"sex": $scope.bank_man.sex,
            //"headImg": $scope.bank_man.headImg,
            "mobile": $scope.bank_man.mobile,
            "email": $scope.bank_man.email,
            "position": $scope.bank_man.position,
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
                    console.log("添加成功");
                    $state.go("master.bank.bank_man", {id: m_params.bankId});
                    //$location.path("master/bank/bank_man"+$stateParams.id);
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