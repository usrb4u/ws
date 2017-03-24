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

$scope.regUser = function(){
    console.log($scope.reg);
    var formData = {
        name:$scope.reg.name,
        email: $scope.email,
        password:$scope.password
    }
    if($scope.reg.password==$scope.reg.confirm){
        $http.post('/signup',formData).success(function(data){
            alert(data);
        })
    }else
    alert('Password not matching');
}

})