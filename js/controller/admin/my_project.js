var myProjectCtrl = angular.module('myProjectCtrl', []);
myProjectCtrl.controller('MyProjectCtrl', function ($http, $scope, $rootScope, $location) {
    $scope.showCancel = false;

    $scope.comments_give = '';

    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            "status": $scope.status
        };
        $http({
            url: api_uri + "applyDeal/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result.list;
                $scope.result_list = d.result.list.datas;
                $scope.count = d.result.count;
                angular.forEach($scope.result_list, function (data) {
                    $scope.status = d.result.status;
                    if (data.status == 0) {
                        data.progressText = "未申请";
                        data.color = 1;
                    } else if (data.status == 1) {
                        data.progressText = "申请中";
                        data.progressBtn = "开始约见";
                        data.color = 2;
                    } else if (data.status == 2) {
                        data.progressText = "约见中";
                        data.progressBtn = "继续跟进";
                        data.color = 2;
                    } else if (data.status == 3) {
                        data.progressText = "跟进中";
                        data.progressBtn = "完成贷款";
                        data.color = 2;
                    } else if (data.status == 4) {
                        data.progressText = "成功融资";
                        data.progressBtn = "已结束";
                        data.color = 3;
                    } else if (data.status == -1) {
                        data.progressText = "申请取消";
                        data.color = 1;
                    }
                });
            }
            else {
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };

    $scope.updateApply = function (id) {
        $location.path('/admin/my_project/detail/' + id);
    };

    $scope.nextStatus = function (id, status) {
        if (status < 4) {
            status++;
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                status: status
            };
            $http({
                url: api_uri + "loanApplicationManage/next/" + id,
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                }

            }).error(function (d) {
                $location.path("/error");
            })
        } else {
        }

    };

    $scope.list(1, 20);
    $scope.changePage = function (page) {
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };
    $scope.selected = [];
    $scope.ids = [];

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

    $scope.refresh = function () {
        $scope.list($scope.pageNo1, 10);
    };

    $scope.showDetail = function (id) {
        $location.path('/admin/my_project/detail/' + id);

    };

    $scope.delete = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            ids: $scope.ids,
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };

        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {

                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 10);
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.cancel = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
        };
        $http({
            url: api_uri + "loanApplicationManage/cancel",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.list($scope.pageNo1, 10);
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.show_cancel = function () {
        $scope.showCancel = true;
    };
    $scope.hide_cancel = function () {
        $scope.showCancel = false;
    };

    $scope.giveUp = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "ids": $scope.ids,
            "c": $scope.comments_give
        };
        console.log(m_params);
        if (m_params.ids.length == 0) {
            alert("没有选择项目");
        } else if (m_params.c == '') {
            alert("必须填写放弃原因");
        } else {
            $.ajax({
                type: 'GET',
                url: api_uri + "loanApplicationManage/giveUp",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    // console.log(data);
                    if (data.returnCode == 0) {
                        // console.log(data);
                        $scope.list($scope.pageNo1, 20);
                    }
                    else {
                        // console.log(data);
                    }
                },
                dataType: 'json',
            });
        }


    };

    $scope.linkCompany = function(id ,remark) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": id,
            "remark": remark
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/update",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.status_text = "全部";
    $scope.choice = function (status) {
        $scope.status = status;
        if ($scope.status == 0) {
            $scope.status_text = "未申请";
        } else if ($scope.status == 1) {
            $scope.status_text = "申请中";
        } else if ($scope.status == 2) {
            $scope.status_text = "约见中";
        } else if ($scope.status == 3) {
            $scope.status_text = "跟进中";
        } else if ($scope.status == 4) {
            $scope.status_text = "成功融资";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };

});

myProjectCtrl.controller('DetailCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    /*添加删除模板*/
    $scope.id = $stateParams.id;

    // $scope.isAllot = '';
    $scope.get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "inforTemplate/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.isAllot = d.result.isAllot;
            $scope.days = d.result.days;
            $scope.w = d.result.w;
            $scope.registerLinkmanName = d.result.registerLinkmanName;
            $scope.registerLinkmanMobile = d.result.registerLinkmanMobile;
            $scope.bankId = d.result.bankId;
            $scope.bankName = d.result.bankName;
            $scope.productName = d.result.productName;
            $scope.dealRemark = d.result.dealRemark;
            $scope.readonly = d.result.readonly;
            $scope.type = d.result.type;
            if (d.result.remark) {
                $scope.remark = d.result.remark;
            }
            $scope.applyTime = d.result.applyTime;
            $scope.basic = d.result.baseInfo;
            $scope.model_list = d.result.templateList;
            $scope.status = d.result.status;
            if ($scope.status == 0) {
                $scope.progressText = "未申请";
                $scope.jindu = 0;
            } else if ($scope.status == 1) {
                $scope.progressText = "申请中";
                $scope.progressBtn = "开始约见";
                $scope.jindu = 20;
            } else if ($scope.status == 2) {
                $scope.progressText = "约见中";
                $scope.progressBtn = "继续跟进";
                $scope.jindu = 50;
            } else if ($scope.status == 3) {
                $scope.progressText = "跟进中";
                $scope.progressBtn = "完成贷款";
                $scope.jindu = 70;
            } else if ($scope.status == 4) {
                $scope.progressText = "成功融资";
                $scope.progressBtn = "已结束";
                $scope.jindu = 100;
            } else if ($scope.status == -1) {
                $scope.progressText = "申请取消";
            }
        }).error(function (d) {

        })
    };
    $scope.get();

    $scope.get_message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
        };
        $http({
            url: api_uri + "apply/comments/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.message_list = d.result;
        }).error(function (d) {

        })
    };
    $scope.get_message();

    $scope.editApply = function (id) {
        if ($scope.type == 2) {
            alert('个人产品暂不支持修改信息');
        } else {
            $location.path('/admin/my_project/edit_apply/' + id);
        }

    };
    $scope.apply = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": id,
        };
        $http({
            url: api_uri + "applyDeal/apply",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $rootScope.putSessionObject('from_route', 'admin.my_project');
                $rootScope.showBtn = 2;
            }
            else {
                //console.log(d);
            }

        }).error(function (d) {
        })
    };

    $scope.apply_help = function (id) {
        $location.path('/admin/my_project/apply_help/' + id);
    };

    $scope.apply_again = function (id, mobile) {
        $location.path('/admin/my_project/apply_again/' + id + '/' + mobile);
    };

    $scope.messages = function (id) {
        $location.path('/admin/my_project/message/' + id);
    };

    $scope.remark_submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "content": $scope.content,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "apply/comments/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    // alert('留言成功');
                    $scope.content = '';
                    $scope.get_message();
                }
                else {
                    alert('留言失败');
                }
            },
            dataType: 'json',
        });

    };

    $scope.distribute = function (id) {
        $location.path('/admin/my_project/distribute/' + id);
    };

    $scope.add_fee = function () {
        $(".add-fee").css("display", "block");
        $(".add-loan").css("display", "none");
    };
    $scope.add_loan = function () {
        $(".add-loan").css("display", "block");
        $(".add-fee").css("display", "none");
    };
    $scope.cancel_add = function () {
        $(".add-fee").css("display", "none");
        $(".add-loan").css("display", "none");
    };
    $scope.update_loan = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "loanValue": $scope.loanValue,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/updateLoanValue",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $(".add-loan").css("display", "none");
                    $scope.get();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };
    $scope.update_fee = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "fee": $scope.fee,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/updateFee",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $(".add-fee").css("display", "none");
                    $scope.get();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    $scope.reBackDetails = function () {
        var from_route = $rootScope.getSessionObject("from_route");
        var from_route2 = $rootScope.getSessionObject("from_route2");
        var from_params = $rootScope.getSessionObject("from_params");
        if (from_route == "admin.my_project" || from_route == "admin.company_message") {
            $state.go(from_route);
        } else if (from_route2 == null) {
            $state.go(from_route);
        }else{
            $location.path(from_route2+from_params);
        }
    };

    $scope.change_company = function (id) {
        $location.path('/admin/my_project/change_company/' + id);
        // console.log(id);
    };

    $scope.choice_sale = function (id) {
        $location.path('/admin/my_project/choice_sale/' + id);
    };

});

myProjectCtrl.controller('EditApplyCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams, $routeParams) {
    /*添加删除模板*/
    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
    $scope.get = function () {
        $scope.get_id_arr = [];
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token
        };
        $http({
            url: api_uri + "inforTemplate/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            $scope.basic = d.result.baseInfo;
            $scope.registerLinkmanName = d.result.registerLinkmanName;
            $scope.registerLinkmanMobile = d.result.registerLinkmanMobile;
            $scope.model_list = d.result.templateList;
            $scope.img_model_count = 0;
            $scope.img_model_arr = [];
            for (var i = 0, j = 0; i < $scope.model_list.length; i++) {
                $scope.model_list[i].id_model = i;
                if ($scope.model_list[i].templateType == 3) {
                    $scope.model_list[i].img_model_id = "img_model" + j;
                    $scope.model_list[i].img_model_div = "imgList_model" + j;
                    $scope.img_model_arr.push(j);
                    $scope.img_model_count++;
                    j++;
                }
            }
            console.log($scope.model_list);
            console.log($scope.img_model_arr);
            $scope.picSave();
        }).error(function (d) {
        })
    };
    $scope.get();

    $scope.model = {
        title: "",
        content: "",
        name: ""
    };
    $scope.picSave = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token
        };
        $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.qiniu_token = d.result.uptoken;
                $scope.saveImg = 0;
                for (var i = 0; i < $scope.img_model_count; i++) {
                    if (i == 0) {
                        var uploader = Qiniu.uploader({
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model0',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model0',           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '10mb',           //最大文件体积限制
                            flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: false,                   //开启可拖曳上传
                            drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '4mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function (up, files) {
                                },
                                'BeforeUpload': function (up, file) {
                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        });
                    } else if (i == 1) {
                        var Q2 = new QiniuJsSDK();
                        var uploader2 = Q2.uploader({
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model1',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model1',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        });
                        console.log(uploader2);
                    } else if (i == 2) {
                        var Qiniu3 = new QiniuJsSDK();
                        var uploader3 = Qiniu3.uploader({
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model2',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model2',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        });
                        console.log(uploader3);
                    } else if (i == 3) {
                        var Qiniu4 = new QiniuJsSDK();
                        var option4 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model3',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model3',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader4 = Qiniu4.uploader(option4);
                    } else if (i == 4) {
                        var Qiniu5 = new QiniuJsSDK();
                        var option5 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model4',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model4',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader5 = Qiniu5.uploader(option5);
                    } else if (i == 5) {
                        var Qiniu6 = new QiniuJsSDK();
                        var option6 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model5',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model5',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader6 = Qiniu6.uploader(option6);
                    } else if (i == 6) {
                        var Qiniu7 = new QiniuJsSDK();
                        var option7 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model6',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model6',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader7 = Qiniu7.uploader(option7);
                    } else if (i == 7) {
                        var Qiniu8 = new QiniuJsSDK();
                        var option8 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model7',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model7',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader8 = Qiniu8.uploader(option8);
                    } else if (i == 8) {
                        var Qiniu9 = new QiniuJsSDK();
                        var option9 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model9',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model8',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader9 = Qiniu9.uploader(option9);
                    } else if (i == 9) {
                        var Qiniu10 = new QiniuJsSDK();
                        var option10 = {
                            runtimes: 'html5,flash,html4',    //上传模式,依次退化
                            browse_button: 'img_model9',       //上传选择的点选按钮，**必需**
                            //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                            uptoken: $scope.qiniu_token,
                            //	        get_new_uptoken: true,
                            //save_key: true,
                            domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                            container: 'imgList_model9',           //上传区域DOM ID，默认是browser_button的父元素，
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

                                },
                                'UploadProgress': function (up, file) {
                                    // 每个文件上传时,处理相关的事情

                                },
                                'FileUploaded': function (up, file, info) {
                                    var res = $.parseJSON(info);

                                    var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                                    $timeout(function () {
                                        $scope.model_list[$scope.saveImg].imgList.push(file_url);
                                    });
                                },
                                'Error': function (up, err, errTip) {
                                    $rootScope.alert("图片上传失败！");
                                },
                                'UploadComplete': function () {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function (up, file) {
                                    var time = new Date().getTime();
                                    var k = 'inforTemplate/saveList/' + $rootScope.login_user.userId + '/' + time;
                                    return k;
                                }
                            }
                        };
                        var uploader10 = Qiniu10.uploader(option10);

                    }


                };
                $scope.get_id = function (d) {
                    $scope.saveImg = d;
                    console.log($scope.saveImg);
                };
            } else {
            }
        }).error(function (d) {
        });

    };
    $scope.addModel = function (templateType) {
        if ($scope.model_list) {
            var id_model = $scope.model_list.length;
        } else {
            $scope.model_list = [];
            var id_model = 0;
        }
        $scope.model_list.push({
            "id_model": id_model,
            "templateType": templateType,
            "title": $scope.model.title,
            "content": $scope.model.content,
            "name": "",
            "imgList": []
        });
        if (templateType == 3) {
            $scope.model_list[id_model].img_model_id = "img_model" + $scope.img_model_count;
            $scope.model_list[id_model].img_model_div = "imgList_model" + $scope.img_model_count;
            console.log($scope.img_model_count);
            $scope.img_model_count++;
            $scope.picSave();
        }
        id_model++;
    };
    $scope.delete = function (id) {
        $scope.model_list.splice(id, 1);
    };
    /*保存基本信息*/

    $scope.basicMessage = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "applyId": $stateParams.id,
            "id": $scope.basic.id,
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "company_name": $scope.basic.company_name,
            "legal_representative": $scope.basic.legal_representative,
            "register_date": $scope.basic.register_date,
            "registered_capital": $scope.basic.registered_capital,
            "business_address": $scope.basic.business_address,
            "item_category": $scope.basic.item_category,
            "business_type": $scope.basic.business_type,
            "business_scope": $scope.basic.business_scope,
            "linkmanName": $scope.basic.linkmanName,
            "linkmanMobile": $scope.basic.linkmanMobile,
            // "fee": $scope.basic.fee,
            // "loanValue": $scope.basic.loanValue,
            "continual": $scope.basic.continual,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveBase",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.id_basic = data.result;
                    $scope.other();
                    //$scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    /*保存其他信息*/
    $scope.other = function () {
        var list = [];
        //var list_string = [];
        for (var i = 0; i < $scope.model_list.length; i++) {
            list.push({
                "title": $scope.model_list[i].title,
                "name": $scope.model_list[i].name,
                "templateType": $scope.model_list[i].templateType,
                "content": $scope.model_list[i].content,
                "imgList": $scope.model_list[i].imgList
            })
        }
        ;
        //var list_string = JSON.stringify(list);
        var m_params1 = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "comId": $scope.id_basic,
            "list": JSON.stringify(list)
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/saveList",
            data: m_params1,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $location.path("admin/my_project/detail/" + $stateParams.id);
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };
    $scope.submitMessage = function () {
        $scope.basicMessage();
    };
    $scope.saveImg = "";
    $scope.removeImgList = function (id, index) {
        id.splice(index, 1);
    };
});

myProjectCtrl.controller('DistributeCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams, $stateParams) {
    /*添加删除模板*/
    $scope.id = $stateParams.id;

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

    $scope.bank_man_list_get = function (id, pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "bankId": id
        };
        $http({
            url: api_uri + "manage/bank/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.bank_man_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.choiceBankMan = function (id, name) {
        $scope.bankManId = id;
        $scope.bankManName = name;
    }
    $scope.submit_user = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": $scope.id,
            "bankUserId": $scope.bankManId
        };
        $http({
            url: api_uri + "loanApplicationManage/allot/",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                alert("递交成功");
                //$state.go("master.my_project");
                $location.path('/admin/my_project/detail/' + $scope.id);
            }
            else {
                alert("递交失败");
            }
        }).error(function (d) {
        })
    };

    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
        $scope.bank_man_list($scope.bankId, 1, 400)
    };
});

myProjectCtrl.controller('ApplyHelpCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    /*添加删除模板*/
    $scope.id = $stateParams.id;
    if ($stateParams.mobile) {
        $scope.applyMobile = $stateParams.mobile;
    }

    $scope.get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $scope.id,
        };
        $http({
            url: api_uri + "loanApplicationManage/getProduct",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.bankName = d.result.bankName;
                $scope.productName = d.result.productName;
                $scope.productId = d.result.productId;
            }
            else {
            }
        }).error(function (d) {
        })
    };
    $scope.get();

    $scope.backProjectDetail = function (id) {
        // console.log(id);
        $location.path('/admin/my_project/detail/' + id);
    };

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

    $scope.editApply = function (id) {
        $location.path('/admin/my_project/edit_apply/' + id);
    };

    $scope.choiceProduct = function (id, name, type) {
        $scope.productId = id;
        $scope.productName = name;
        if (type == 2) {
            alert('企业不可以申请个人产品，请更换');
            $scope.productName = '';
        }
    };

    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
        $scope.product_list_get($scope.bankId, 1, 400)
    };
    $scope.product_list_get = function (id, pageNo, pageSize) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "bankId": id,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "release": true
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $scope.page = d.result;
                $scope.product_list = d.result.datas;
            }
            else {
            }

        }).error(function (d) {
        })
    };

    $scope.submit_help = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "productId": $scope.productId,
            "mobile": $scope.applyMobile,
        };
        console.log(m_params);
        if (m_params.mobile && m_params.mobile != '') {
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/helpApply",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    // console.log(data);
                    if (data.returnCode == 0) {
                        $location.path('/admin/my_project/detail/' + $scope.id);
                        $scope.$apply();
                    }
                    else {
                    }
                },
                dataType: 'json',
            });
        } else {
            alert("手机号不能为空");
        }

    };
});

myProjectCtrl.controller('ChangeCompanyCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    $scope.change = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "mobile": $scope.phone,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "/loanApplicationManage/changeMobile",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    // console.log("创建成功了");
                    $location.path('/admin/my_project/detail/' + $stateParams.id);
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
});

myProjectCtrl.controller('MessageCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    $scope.get_message = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "apply/comments/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.message_list = d.result;
        }).error(function (d) {

        })
    };
    $scope.get_message();
    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
});

myProjectCtrl.controller('ChoiceSaleCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    if (!$scope.sale_id) {
        $scope.sale_id = 0;
    }
    $scope.get_user = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        console.log(m_params);
        $http({
            url: api_uri + "p/user/listSaleDetailByManager",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            $scope.user_list = d.result;
        }).error(function (d) {

        })
    };
    $scope.get_user();
    $scope.submit = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "salerId": $scope.sale_id,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/updateSale",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $scope.reBackDetail();
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    $scope.reBackDetail = function () {
        $location.path("admin/my_project/detail/" + $stateParams.id);
    };
});