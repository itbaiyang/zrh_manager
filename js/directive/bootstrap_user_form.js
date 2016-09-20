var my_directive = angular.module("my_directive", []);
my_directive.directive('bootstrapUserForm', function () {
    return {
        controller: function (scope, form) {
            form.bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    officeAddress: {
                        message: '办公地址错误',
                        validators: {
                            notEmpty: {
                                message: '办公地址不能为空'
                            }
                        }
                    },
                    phoneNum: {
                        message: '办公地址错误',
                        validators: {
                            notEmpty: {
                                message: '办公地址不能为空'
                            }
                            // stringLength: {
                            //     min: 6,
                            //     max: 18,
                            //     message: '用户名长度必须在6到18位之间'
                            // },
                            // regexp: {
                            //     regexp: /^[a-zA-Z0-9_]+$/,
                            //     message: '用户名只能包含大写、小写、数字和下划线'
                            // }
                        }
                    },
                    // email: {
                    //     validators: {
                    //         notEmpty: {
                    //             message: '邮箱不能为空'
                    //         },
                    //         emailAddress: {
                    //             message: '邮箱地址格式有误'
                    //         }
                    //     }
                    // }
                }
            });
        }
    }
});
