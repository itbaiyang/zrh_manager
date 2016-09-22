var myProjectCtrl = angular.module('myProjectCtrl', []);
myProjectCtrl.controller('MyProjectCtrl', function ($http, $scope, $rootScope, $location) {
    $scope.showCancel = false; //放弃任务取消理由框显示
    $scope.comments_give = '';  //留言板评论内容

    /* 获取我的项目列表*/
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
                $scope.page = d.result.list;              //分页
                $scope.result_list = d.result.list.datas; //列表参数
                $scope.count = d.result.count;            //列表统计
                $scope.userName = d.result.userName;
                angular.forEach($scope.result_list, function (data) { //申请状态显示
                    if (data.status == 0) {
                        data.progressText = "未申请";
                        data.color = 1;
                    } else if (data.status == 1) {
                        data.progressText = "准备中";
                        data.color = 2;
                    } else if (data.status == 2) {
                        data.progressText = "下户";
                        data.color = 2;
                    } else if (data.status == 3) {
                        data.progressText = "审批中";
                        data.color = 2;
                    } else if (data.status == 4) {
                        data.progressText = "审批通过";
                        data.color = 2;
                    } else if (data.status == 5) {
                        data.progressText = "下户";
                        data.color = 2;
                    } else if (data.status == 6) {
                        data.progressText = "放款";
                        data.color = 2;
                    } else if (data.status == 7) {
                        data.progressText = "成功融资";
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
    $scope.list(1, 20);
    if (!$scope.pageNo1) {
        $scope.pageNo1 = 1;
    }
    $scope.changePage = function (page) {  //列表分页函数
        $scope.pageNo1 = page;
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };

    /*选中申请相关,目前只做放弃项目*/
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

    /*搜索,筛选,刷新页面*/
    $scope.refresh = function () {
        $scope.list($scope.pageNo1, 10);
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
            $scope.status_text = "准备中";
        } else if ($scope.status == 2) {
            $scope.status_text = "下户";
        } else if ($scope.status == 3) {
            $scope.status_text = "审批中";
        } else if ($scope.status == 4) {
            $scope.status_text = "审批通过";
        } else if ($scope.status == 5) {
            $scope.status_text = "开户";
        } else if ($scope.status == 6) {
            $scope.status_text = "放款";
        } else if ($scope.status == 7) {
            $scope.status_text = "成功融资";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };

    /*跳转页面函数*/
    $scope.showDetail = function (id) {
        $location.path('/admin/my_project/detail/' + id);

    };

    /*放弃任务相关函数*/
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
                    console.log(data);
                    if (data.returnCode == 0) {
                        console.log(data);
                        $scope.ids = [];
                        $scope.list($scope.pageNo1, 20);
                        $scope.hide_cancel();
                        $scope.code_list = data.result;
                        if ($scope.code_list) {
                            for (var i = 0; i < $scope.code_list.length; i++) {
                                if ($scope.code_list[i].code == 10002) {
                                    alert($scope.code_list[i].name + "，你已经选择了销售职员，所以不可以放弃项目，如果要放弃，请选择自己为销售职员");
                                } else if ($scope.code_list[i].code == 10001) {
                                    alert("申请不存在,请刷新页面");
                                } else {
                                    $rootScope.successMsg = "操作成功";
                                    $rootScope.fadeInOut("#alert", 500);
                                }
                            }
                        }
                    }
                },
                dataType: 'json',
            });
        }


    };


    /*暂时搁置的函数*/
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
    $scope.delete = function () {
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
                $scope.list($scope.pageNo1, 20);
                $scope.hide_cancel();
            }
            else {
            }

        }).error(function (d) {
        })
    };
    $scope.linkCompany = function (id, remark) {
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
});

myProjectCtrl.controller('DetailCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {

    $scope.id = $stateParams.id;  //获取路由参数

    /*获取申请详情*/
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
                $scope.progressText = "准备中";
                $scope.progressBtn = "下户";
                $scope.jindu = 10;
            } else if ($scope.status == 2) {
                $scope.progressText = "下户";
                $scope.progressBtn = "审批中";
                $scope.jindu = 20;
            } else if ($scope.status == 3) {
                $scope.progressText = "审批中";
                $scope.progressBtn = "审批通过";
                $scope.jindu = 35;
            } else if ($scope.status == 4) {
                $scope.progressText = "审批通过";
                $scope.progressBtn = "开户";
                $scope.jindu = 55;
            } else if ($scope.status == 5) {
                $scope.progressText = "开户";
                $scope.progressBtn = "放款";
                $scope.jindu = 70;
            } else if ($scope.status == 6) {
                $scope.progressText = "放款";
                $scope.progressBtn = "完成融资";
                $scope.jindu = 85;
            } else if ($scope.status == 7) {
                $scope.progressText = "完成融资";
                $scope.jindu = 100;
            } else if ($scope.status == -1) {
                $scope.progressText = "完成融资";
            }
        }).error(function (d) {

        })
    };
    $scope.get();

    /*获取公司留言板列表*/
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
            $scope.message_list = d.result;
        }).error(function (d) {
            console.log(d);
        })
    };
    $scope.get_message();

    /*跳转页面*/
    $scope.editApply = function (id) {
        if ($scope.type == 2) {
            alert('个人产品暂不支持修改信息');
        } else {
            $location.path('/admin/my_project/edit_apply/' + id);
        }

    };  //编辑页面
    $scope.apply_help = function (id) {
        $location.path('/admin/my_project/apply_help/' + id);
    }; //帮助申请
    $scope.change_bank = function (id, mobile) {
        $location.path('/admin/my_project/change_bank/' + id + '/' + mobile);
    }; //更改银行
    $scope.messages = function (id) {
        $location.path('/admin/my_project/message/' + id);
    };   //留言板
    $scope.distribute = function (id) {
        $location.path('/admin/my_project/distribute/' + id);
    };//递交资料
    $scope.change_company = function (id) {
        $location.path('/admin/my_project/change_company/' + id);
        // console.log(id);
    };//更改银行
    $scope.choice_sale = function (id) {
        $location.path('/admin/my_project/choice_sale/' + id);
    }; //选择销售人员
    $scope.reBackFromDetails = function () {
        var from_route = $rootScope.getSessionObject("from_route");
        var from_route2 = $rootScope.getSessionObject("from_route2");
        var from_params = $rootScope.getSessionObject("from_params");
        if (from_route == "admin.my_project" || from_route == "admin.company_message") {
            $state.go(from_route);
        } else if (from_route2 == null) {
            $state.go(from_route);
        } else {
            $location.path(from_route2 + from_params);
        }
    }; //返回上一级页面

    /*我要处理*/
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
            if (d.returnCode == 0) {
                $rootScope.putSessionObject('from_route', 'admin.my_project');
                $rootScope.showBtn = 2;
                $rootScope.successMsg = "成功领取项目";
                $rootScope.fadeInOut("#alert", 500);
            } else if (d.returnCode == 1002) {
                alert("申请状态错误");
            } else if (d.returnCode == 1003) {
                alert("用户不存在");
            } else if (d.returnCode == 1000) {
                alert("服务器异常");
            } else {
                alert("其他未知错误");
            }
        }).error(function (d) {
        })
    };

    /*发布评论*/
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
                    $scope.content = '';
                    $scope.get_message();
                    $rootScope.successMsg = "发布成功";
                    $rootScope.fadeInOut("#alert", 500);
                } else if (d.returnCode == 1003) {
                    alert("申请不存在，发布失败");
                } else if (d.returnCode == 1000) {
                    alert("服务器错误");
                } else {
                    alert("其他未知错误");
                }
            },
            dataType: 'json',
        });

    };

    /*添加服务费和融资额度*/
    $scope.add_fee = function (id) {
        $scope.msg = '';
        $(".add-fee").css("display", "block");
        $(".add-loan").css("display", "none");
        if (id == 3) {
            $scope.msg = '修改成功';
        } else if (id == 4) {
            $scope.msg = '填写成功';
        } else {
            alert("异常");
        }
    };
    $scope.add_loan = function (id) {
        $scope.msg = '';
        $(".add-loan").css("display", "block");
        $(".add-fee").css("display", "none");
        if (id == 1) {
            $scope.msg = '修改成功';
        } else if (id == 2) {
            $scope.msg = '填写成功';
        } else {
            alert("异常");
        }
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
                    $rootScope.successMsg = $scope.msg;
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.msg = '';
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
                    $rootScope.successMsg = $scope.msg;
                    $rootScope.fadeInOut("#alert", 500);
                }
                else {
                }
            },
            dataType: 'json',
        });

    };
});

myProjectCtrl.controller('EditApplyCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams, $routeParams) {
    /*跳转页面*/
    $scope.backProjectDetail = function () {
        $location.path('/admin/my_project/detail/' + $stateParams.id);
    }; //返回详情页面

    /*获取企业详情*/
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
    }; //初始化模块
    /*图片加载初始化*/
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

    /*添加模块*/
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

    /*删除模块*/
    $scope.delete = function (id) {
        $scope.model_list.splice(id, 1);
    };

    /*表单验证*/
    // $scope.check =  function () {
    //     $('#editApply').bootstrapValidator({
    //         message: 'This value is not valid',
    //         feedbackIcons: {
    //             valid: 'glyphicon glyphicon-ok',
    //             invalid: 'glyphicon glyphicon-remove',
    //             validating: 'glyphicon glyphicon-refresh'
    //         },
    //         fields: {
    //             officeAddress: {
    //                 message: '办公地址错误',
    //                 validators: {
    //                     notEmpty: {
    //                         message: '办公地址不能为空'
    //                     }
    //                     // stringLength: {
    //                     //     min: 6,
    //                     //     max: 18,
    //                     //     message: '用户名长度必须在6到18位之间'
    //                     // },
    //                     // regexp: {
    //                     //     regexp: /^[a-zA-Z0-9_]+$/,
    //                     //     message: '用户名只能包含大写、小写、数字和下划线'
    //                     // }
    //                 }
    //             },
    //             email: {
    //                 validators: {
    //                     notEmpty: {
    //                         message: '邮箱不能为空'
    //                     },
    //                     emailAddress: {
    //                         message: '邮箱地址格式有误'
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // };
    // $scope.check();
    /*保存信息*/
    $scope.submitMessage = function () {
        var m_params = {
            "applyId": $stateParams.id,
            "id": $scope.basic.id,
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "company_name": $scope.basic.company_name,
            "legal_representative": $scope.basic.legal_representative,
            "register_date": $scope.basic.register_date,
            "registered_capital": $scope.basic.registered_capital,
            "officeAddress": $scope.basic.officeAddress,
            "business_address": $scope.basic.business_address,
            "item_category": $scope.basic.item_category,
            "business_type": $scope.basic.business_type,
            "business_scope": $scope.basic.business_scope,
            "linkmanName": $scope.basic.linkmanName,
            "linkmanMobile": $scope.basic.linkmanMobile,
            "continual": $scope.basic.continual,
        };
        if (!m_params.officeAddress) {
            // alert("请输入办公地点");
        } else if (!m_params.linkmanMobile) {
            // alert("请输入联系人电话");
        } else {
            $.ajax({
                type: 'POST',
                url: api_uri + "inforTemplate/saveBase",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        $scope.id_basic = data.result;
                        $scope.modelMessage();
                        //$scope.$apply();
                    }
                    else {
                    }
                },
                dataType: 'json',
            });
        }


    };
    $scope.modelMessage = function () {
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
                    $rootScope.successMsg = "修改成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $location.path("admin/my_project/detail/" + $stateParams.id);
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });

    };

    $scope.saveImg = ""; //图片数组初始化
    $scope.removeImgList = function (id, index) {
        id.splice(index, 1);
    }; //删除图片
});

myProjectCtrl.controller('DistributeCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams, $stateParams) {

    $scope.id = $stateParams.id; //获取路由申请Id

    /*获取银行列表*/
    $scope.bank_list_get = function (pageNo, pageSize) {
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
    $scope.bank_list_get(1, 100);

    /*获取银行职员列表*/
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

    /*选择银行*/
    $scope.choiceBank = function (id, name) {
        $scope.bankId = id;
        $scope.bankName = name;
        $scope.bank_man_list_get($scope.bankId, 1, 400)
    };

    /*选择银行职员*/
    $scope.choiceBankMan = function (id, name) {
        $scope.bankManId = id;
        $scope.bankManName = name;
    };

    /*递交资料*/
    $scope.submit_user = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "id": $scope.id,
            "bankUserId": $scope.bankManId
        };
        if (!m_params.bankUserId) {
        }
        else {
            $http({
                url: api_uri + "loanApplicationManage/allot/",
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $rootScope.successMsg = "递交成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.backProjectDetail();
                } else if (d.returnCode == 1001) {
                    alert("该申请已经被递交");
                } else if (d.returnCode == 1002) {
                    alert("企业未申请状态或其他未知状态");
                } else if (d.returnCode == 1003) {
                    alert("申请不存在");
                } else if (d.returnCode == 1004) {
                    alert("企业名称不存在");
                } else if (d.returnCode == 1005) {
                    alert("资料不够完善");
                } else {
                    alert("其他未知因素导致递交失败，请联系后台人员");
                }
            }).error(function (d) {
            })
        }
    };

    /*返回详情列表*/
    $scope.backProjectDetail = function () {
        $location.path('/admin/my_project/detail/' + $stateParams.id);
    };
});

myProjectCtrl.controller('ApplyHelpCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    /*初始化参数*/
    $scope.applyMobile = '';
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

    $scope.submit_help = function (msg) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
            "productId": $scope.productId,
            "mobile": $scope.applyMobile,
        };
        console.log(m_params);
        if (!m_params.productId) {
            alert("请选择银行和产品");
        } else if (!m_params.applyId) {
            alert("该申请不存在");
        } else if (!m_params.mobile) {
            alert("电话号码不能为空");
        } else {
            console.log("dd");
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplicationManage/helpApply",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        if (msg == 0) {
                            $rootScope.successMsg = "操作成功";
                        } else {
                            $rootScope.successMsg = "更换成功";
                        }
                        $rootScope.fadeInOut("#alert", 500);
                        $location.path('/admin/my_project/detail/' + $scope.id);
                        $scope.$apply();
                    } else if (data.returnCode == 1003) {
                        alert("申请")
                    }
                },
                dataType: 'json',
            });
        }

    };
});

myProjectCtrl.controller('ChangeRegisterCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {

    /*渠道申请注册人向企业注册人变更*/
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
                    $rootScope.successMsg = "变更成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $location.path('/admin/my_project/detail/' + $stateParams.id);
                    $scope.$apply();
                } else if (data.returnCode == 1002) {
                    alert("该申请已经处理过了")
                } else if (data.returnCode == 1003) {
                    alert("申请不存在")
                } else {
                    alert("未知错误");
                }
            },
            dataType: 'json',
        });
    };

    /*跳转到详情页面*/
    $scope.backProjectDetail = function () {
        $location.path('/admin/my_project/detail/' + $stateParams.id);
    };
});

myProjectCtrl.controller('MessageCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {

    /*获取留言列表*/
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

    /*返回详情页面*/
    $scope.backProjectDetail = function () {
        $location.path('/admin/my_project/detail/' + $stateParams.id);
    };
});

myProjectCtrl.controller('ChoiceSaleCtrl', function ($http, $scope, $state, $rootScope, $stateParams, $location, $routeParams) {
    /*初始化参数*/
    if (!$scope.sale_id) {
        $scope.sale_id = '';
    }
    /*获取aleId*/
    $scope.get_saleId = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "applyId": $stateParams.id,
        };
        console.log(m_params);
        $http({
            url: api_uri + "p/user/getSalerByApplyId",
            method: "GET",
            params: m_params
        }).success(function (d) {
            $scope.saleId = d.result.id;
        }).error(function (d) {

        })
    };

    /*获取用户列表*/
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
            $scope.get_saleId();
        }).error(function (d) {

        })
    };
    $scope.get_user();

    /*给销售人员*/
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
                    $rootScope.successMsg = "操作成功";
                    $rootScope.fadeInOut("#alert", 500);
                    $scope.backProjectDetail();
                    $scope.$apply();
                }
                else {
                }
            },
            dataType: 'json',
        });
    };

    /*返回到详情页面*/
    $scope.backProjectDetail = function () {
        $location.path('/admin/my_project/detail/' + $stateParams.id);
    };
});
