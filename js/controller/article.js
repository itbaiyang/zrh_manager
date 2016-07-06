/**
 * Created by baiyang on 2016/7/4.
 */
var articleCtrl = angular.module('articleCtrl', []);
articleCtrl.controller('CreateCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
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
    var m_params = {"userId":"ffc41f5e8b96471aba063370826b1a87","token":"45d2a5274cf357c829414a67acf0df287375414f"}
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
                            $scope.bankPic = file_url;
                            $scope.$apply();
                            /*var m_params = {
                                "userId":"ffc41f5e8b96471aba063370826b1a87",
                                "token":"9794e4063b94a357be401fa2faed59683a4d79af"
                            };*/
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
        var m_params = {
            "userId":"ffc41f5e8b96471aba063370826b1a87",
            "token":"45d2a5274cf357c829414a67acf0df287375414f",
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
                    console.log("创建成功了")
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

articleCtrl.controller('ReleaseCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    var result_list = [];
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId":"ffc41f5e8b96471aba063370826b1a87",
            "token":"45d2a5274cf357c829414a67acf0df287375414f",
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "financialProductManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.result_list = d.result.datas;
                console.log($scope.result_list);
                $scope.totalCount = d.result.totalCount;
                $scope.paginationConf.totalItems = $scope.totalCount;
                $scope.totalPage = d.result.totalPage;
                $scope.paginationConf.numberOfPages = $scope.totalPage;
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

    //$scope.list(1,20);
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        //perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };
    $scope.hideBefore = false
    $scope.$watch('paginationConf.currentPage', function () {
        if ($scope.paginationConf.currentPage == 1) {
            $scope.hideBefore = true;
        }
        // console.log($scope.paginationConf.currentPage);
        $scope.list($scope.paginationConf.currentPage, 15);
    });

    $scope.selected = [];
    //$scope.ids = [];
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
            //console.log($scope.ids);
        }
    };
    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    }
    $scope.submit = function () {
        var m_params = {
            "userId":"ffc41f5e8b96471aba063370826b1a87",
            "token":"45d2a5274cf357c829414a67acf0df287375414f",
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
        var m_params = {
            "userId":"ffc41f5e8b96471aba063370826b1a87",
            "token":"45d2a5274cf357c829414a67acf0df287375414f",
            'ids': $scope.ids
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

articleCtrl.controller('LoanApplicationCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    var result_list = [];

    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId":"ffc41f5e8b96471aba063370826b1a87",
            "token":"45d2a5274cf357c829414a67acf0df287375414f",
            pageNo: pageNo,
            pageSize: pageSize,
        };
        $http({
            url: api_uri + "loanApplicationManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.result_list = d.result.datas;
                //console.log($scope.result_list);
                $scope.totalCount = d.result.totalCount;
                $scope.paginationConf.totalItems = $scope.totalCount;
                $scope.totalPage = d.result.totalPage;
                $scope.paginationConf.numberOfPages = $scope.totalPage;
                angular.forEach($scope.result_list, function (data) {
                    $scope.status = d.result.status;
                    if (data.status == 0) {
                        data.progressText = "未申请";
                    } else if (data.status == 1) {
                        data.progressText = "审核中";
                    } else if (data.status == 2) {
                        data.progressText = "约见中";
                    } else if (data.status == 3) {
                        data.progressText = "跟进中";
                    } else if (data.status == 4) {
                        data.progressText = "成功融资";
                        data.progressBtn = "已结束";
                    } else if (data.status == -1) {
                        data.progressText = "申请取消";
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
    $scope.nextStatus = function (id,status) {
        //console.log(id);
        //console.log(status);
        if(status <4){
            status++;
            var m_params = {
                "userId":"ffc41f5e8b96471aba063370826b1a87",
                "token":"45d2a5274cf357c829414a67acf0df287375414f",
                status:status
            };
            //console.log(m_params);
            $http({
                url: api_uri + "loanApplicationManage/next/"+id,
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.list($scope.paginationConf.currentPage, 15);
                        }
                else {
                }

            }).error(function (d) {
                console.log("login error");
                $location.path("/error");
            })
        }else{
            console.log("已经融资成功无法执行下一步")
        }

    };
    //$scope.list(1,20);
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        //perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };
    $scope.hideBefore = false;
    $scope.$watch('paginationConf.currentPage', function () {
        if ($scope.paginationConf.currentPage == 1) {
            $scope.hideBefore = true;
        }
        // console.log($scope.paginationConf.currentPage);
        $scope.list($scope.paginationConf.currentPage, 15);
    });

    $scope.selected = [];
    $scope.ids = [];

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };
    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log("添加id");
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
            console.log("删除id");
        }
    };
    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    }
    $scope.submit = function () {
        var m_params = {
            "userId":"ffc41f5e8b96471aba063370826b1a87",
            "token":"45d2a5274cf357c829414a67acf0df287375414f",
            ids: []
        };
        console.log($scope.ids);
        $.ajax({
            type: 'get',
            url: api_uri + "financialProductManage/release",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log('baiyang');
                    //$scope.$apply();
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };
});