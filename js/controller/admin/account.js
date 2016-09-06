var accountCtrl = angular.module('accountCtrl', []);

accountCtrl.controller('AccountCtrl', function ($http, $scope, $state, $rootScope, $location, $routeParams) {
    $scope.showDetail = function (id) {
        $location.path('/admin/share/share_detail/' + id);
        // console.log(id);
    };
});