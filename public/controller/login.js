// var app = angular.module('deviceInfo',[]);

app.controller('loginCtrl', function($scope, $http,$window,$location){

$scope.location = 'login';

$scope.changeLocation = function(val){
    $scope.location = val;
}

})