/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
   /* $scope.to_company_message = function(){
        $location.path('/company_message');
    };
    $scope.to_product = function(){
        $location.path('/product');
    };
    $scope.to_person_baojuan = function(){
        $location.path('/person_baojuan');
    };*/
});

topBarCtrl.controller('SideBarCtrl', function ($http, $scope,$state, $rootScope, $location, $timeout, $routeParams) {
    $scope.$state = $state;
});
