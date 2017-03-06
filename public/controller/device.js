var app = angular.module('deviceInfo',[]);

app.controller('deviceCtrl', function($scope, $http,$window,$location){

    $scope.userName = 'Srinivas';
    $scope.regDev = {};

    $scope.register = function(){
        $window.location.href="/register";
    }

    $scope.getDevices = function(){
        $http.get('/api/getDevices/'+$scope.userName).success(function(result){
            $scope.devList = result;
            // console.log(result);
        })
    }

    $scope.regDevice = function(){
        $scope.regDev.userName = $scope.userName;
        $http.post('/api/regDevice',$scope.regDev).success(function(result){
            if(result=='success'){
                alert('Registered Successfully');
                $window.location.href='/';
            }else
                alert(result);
            
        })
    }
    $scope.getDevices();

    $scope.getAnalogInfo = function(ipAddr,devId){
        $http.get('/api/wiredAnalog/'+devId+'/'+ipAddr).success(function(result){
            if(result=='success'){
                $window.location.href='/wired/'+devId+'/'+ipAddr;
            }else
                alert(result);
        })
    }
    
});