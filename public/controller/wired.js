var app = angular.module('deviceInfo',[]);


app.controller('wiredCtrl', function($scope, $http,$window,$location){
    $scope.userName = 'Srinivas';
    $scope.analog2 =  {"PACKET_ID":"UM_AIN2_CONFIG",
                    "AIN2_STATUS":"DISABLE",}
    $scope.analog1 =  {"PACKET_ID":"UM_AIN1_CONFIG",
                    "AIN1_STATUS":"DISABLE",}
    $scope.analog = {}
    var devInfo = {};    

    // console.log($rootScope.devId);
    console.log($location.path());
    $scope.getDevices = function(){
        $http.get('/api/getDevices/'+$scope.userName).success(function(result){
            $scope.devList = result;
            // console.log(result);
        })
    }
    $scope.getDevices();

    $scope.register = function(){
        $window.location.href = '/register';
    }

    $scope.remove = function(){        
        $http.put('/api/remove/').success(function(result){

        })
    }

    $scope.connect = function(){
        // alert($scope.devId)
        if($scope.analog1.AIN1_STATUS)
            $scope.analog1.AIN1_STATUS = 'ENABLE';
        else
            $scope.analog1.AIN1_STATUS = 'DISABLE';

        if($scope.analog2.AIN2_STATUS)
            $scope.analog2.AIN2_STATUS = 'ENABLE';
        else
            $scope.analog2.AIN2_STATUS = 'DISABLE';

        $scope.analog["analog1"] = $scope.analog1;
        $scope.analog["analog2"]= $scope.analog2;
        
        devInfo["devId"] = $scope.devId;
        devInfo ["ipAddr"] = $scope.ipAddr;

        $scope.analog["devInfo"] = devInfo;

        $http.post('/api/uAnalogInput',$scope.analog).success(function(result){
            alert(result);
        })

        console.log($scope.analog);
    }

    $scope.send = function(){
        
    }

    $scope.getAnalogInfo = function(ipAddr,devId){
        $http.get('/api/wiredAnalog/'+devId+'/'+ipAddr).success(function(result){
            if(result=='success'){
                $window.location.href='/wired/'+devId+'/'+ipAddr;
            }else
                alert(result);
        })
    }

});