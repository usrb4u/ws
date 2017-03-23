// var app = angular.module('deviceInfo',[]);

app.controller('loginCtrl', function($scope, $http,$window,$location){


$scope.login = {};
$scope.reg={};
$scope.location = 'login';

$scope.changeLocation = function(val){
    $scope.location = val;
}

$scope.loginForm = function(){
    alert('login');
}

$scope.register = function(){
    alert('register');
}

})