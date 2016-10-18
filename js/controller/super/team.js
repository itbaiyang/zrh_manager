var teamCtrl = angular.module('teamCtrl', []);
teamCtrl.controller('TeamCtrl',
    ['$http', '$scope', '$state', '$rootScope', '$location', function ($http, $scope, $state, $rootScope, $location) {

    $scope.edit_team_input = [];
    $scope.teamName = "";
    /*团队列表*/
    $scope.list = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "zrh/group/listGroup",
            method: "GET",
            params: m_params
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.team_list = d.result;
            }
            else {
                console.log(d);
            }
        }).error(function (d) {
        })
    };
    $scope.list();
    /*显示可编辑*/
    $scope.edit_team = function (id, index, name) {
        $scope.teamName = name;
        for (var i = 0; i < $scope.edit_team_input.length; i++) {
            $scope.edit_team_input[i] = false;
        }
        $scope.edit_team_input[index] = true;
    };
    /*编辑团队名称*/
    $scope.editTeam = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.teamName,
            "groupId": id,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "zrh/group/updateGroup",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                if (data.returnCode == 0) {
                    $scope.list();
                    for (var i = 0; i < $scope.edit_team_input.length; i++) {
                        $scope.edit_team_input[i] = false;
                    }
                    $scope.name = "";
                }
                else if (data.returnCode == 1003) {
                    alert("用户分组不存在");
                } else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    /*创建团队*/
    $scope.addTeam = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "name": $scope.name,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "zrh/group/addGroup",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list();
                    $scope.$apply();
                } else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    /*删除团队*/
    $scope.deleteTeam = function (id) {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "groupId": id
        };
        console.log(m_params);
        $http({
            url: api_uri + "zrh/group/deleteGroup",
            method: "GET",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                $scope.list();
                for (var i = 0; i < $scope.edit_team_input.length; i++) {
                    $scope.edit_team_input[i] = false;
                }
                $scope.name = "";
            } else if (d.returnCode == 1003) {
                alert("分组不存在");
            } else {
                console.log(d);
            }
        }).error(function (d) {
        });
    };

    /*转到详情页面*/
    $scope.find_detail = function (id) {
        $location.path("super/team/members/" + id);
    };
    }]);

teamCtrl.controller('MembersCtrl',
    ['$http', '$scope', '$rootScope', '$stateParams', function ($http, $scope, $rootScope, $stateParams) {

    /*获取成员列表*/
    $scope.member_list_get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "groupId": $stateParams.id,
        };
        $http({
            url: api_uri + "zrh/group/listUserByGroup",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.member_list = d.result;
                $scope.ids = [];
            }
            else {
                console.log(d);
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };
    $scope.member_list_get();

        /*获取职员列表*/
    $scope.person_list_get = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "groupId": $stateParams.id,
        };
        $http({
            url: api_uri + "zrh/group/listUserOutGroup",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.person_list = d.result;
                $scope.ids = [];
            }
            else {
                console.log(d);
            }
        }).error(function (d) {
            $location.path("/error");
        })
    };
    $scope.person_list_get();

    /*选中申请相关,目前只做放弃项目*/
    $scope.selected = [];
    $scope.ids = [];
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
            console.log($scope.ids);
        }
    };
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    /*添加成员列表*/
    $scope.addToTeam = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "groupId": $stateParams.id,
            "uids": $scope.ids,
        };
        $.ajax({
            type: 'POST',
            url: api_uri + "zrh/group/addUserToGroup",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    // alert("添加成功");
                    $scope.member_list_get();
                    $scope.person_list_get();
                    $scope.$apply();
                } else if (data.returnCode == 1003 && data.result.errorCode == 1) {
                    alert("添加失败");
                } else if (data.returnCode == 1003 && data.result.errorCode == 1001) {
                    alert("已经有分组");
                } else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };
    /*删除成员列表*/
    $scope.deleteFromTeam = function () {
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "groupId": $stateParams.id,
            "uids": $scope.ids,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "zrh/group/removeUserFromGroup",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {

                if (data.returnCode == 0) {
                    // alert("添加成功");
                    $scope.member_list_get();
                    $scope.person_list_get();
                    $scope.$apply();
                } else if (data.returnCode == 1003 && data.result.errorCode == 1003) {
                    alert("用户不再该分组");
                } else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };
    }]);
