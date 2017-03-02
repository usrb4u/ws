var app = angular.module('deviceInfo',[]);

app.controller('deviceCtrl', function($scope, $http,$window,$location){

    $scope.register = function(){
        $window.location.href="/register";
    }
    
});