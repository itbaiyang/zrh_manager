var accountCtrl = angular.module('accountCtrl', []);
accountCtrl.controller('AccountCtrl',
    ['$http', '$scope', '$state', '$rootScope', function ($http, $scope, $state, $rootScope) {
        $scope.choiceUser = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token
            };
            $http({
                url: api_uri + "p/user/detail/" + $rootScope.login_user.userId,
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.role_account = d.result;
                    $rootScope.putObject("role_manage", d.result);
                } else {
                }
            }).error(function (d) {
            })
        };
        $scope.choiceUser();
        $scope.init = function () {
            $http({
                url: api_uri + "qiniu/getUpToken",
                method: "GET",
                params: $rootScope.login_user
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
                                // $scope.user.headImg = file_url;
                                // $scope.$apply();
                                var m_params = {
                                    "userId": $rootScope.login_user.userId,
                                    "token": $rootScope.login_user.token,
                                    "headImg": file_url
                                };
                                $http({
                                    url: api_uri + "p/user/updateHeadImg",
                                    method: "POST",
                                    params: m_params
                                }).success(function (d) {
                                    if (d.returnCode == 0) {
                                        $scope.choiceUser()
                                    } else {
                                    }
                                }).error(function (d) {
                                });
                                // params.key = "headImg";
                                // params.value = $scope.user.headImg;
                                // $.post(api_uri + "p/user/updateHeadImg", m_params,
                                //     function (data) {
                                //         console.log(d);
                                //         if (data.returnCode == 0) {
                                //
                                //         } else {
                                //         }
                                //     },
                                //     "json");
                            },
                            'Error': function (up, err, errTip) {
                                // console.log(err);
                                $rootScope.alert("头像上传失败！");
                            },
                            'UploadComplete': function () {
                                //队列文件处理完毕后,处理相关的事情
                            },
                            'Key': function (up, file) {
                                var time = new Date().getTime();
                                var k = 'admin/account/' + $rootScope.login_user.userId + '/' + time;
                                return k;
                            }
                        }
                    });
                } else {
                }

            }).error(function (d) {
                // console.log(d);
            });

        };
        $scope.init();
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
            $http({
                url: api_uri + "p/user/updatePwd",
                method: "POST",
                params: m_params
            }).success(function (d) {
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