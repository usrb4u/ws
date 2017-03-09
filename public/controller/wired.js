var app = angular.module('deviceInfo',[]);


app.controller('wiredCtrl', function($scope, $http,$window,$location){
    $scope.userName = 'Srinivas';
    $scope.analog2 =  {"PACKET_ID":"UM_AIN2_CONFIG",
                    "AIN2_STATUS":"DISABLE",}
    $scope.analog1 =  {"PACKET_ID":"UM_AIN1_CONFIG",
                    "AIN1_STATUS":"DISABLE",}

    $scope.digital1 =  {"PACKET_ID":"UM_DIN1_CONFIG",
                        "DIN1_STATUS":"DISABLE",
                        "DIN1_ONLABEL":"",
                        "DIN1_OFFLABEL":"",
                        "DIN1_RATE":0}

    $scope.digital2 =  {"PACKET_ID":"UM_DIN2_CONFIG",
                        "DIN2_STATUS":"DISABLE",
                        "DIN2_ONLABEL":"",
                        "DIN2_OFFLABEL":"",
                        "DIN2_RATE":0}

    $scope.aout1 =  {"PACKET_ID":"UM_AOUT1_CONFIG",
                        "AOUT1_STATUS":"DISABLE",
                        "AOUT1_NAME":"",
                        "AOUT1_SCALEFACTOR":'',
                        "AOUT1_OFFSET":'',
                        "AOUT1_RATE":0}

    $scope.aout2 =    {"PACKET_ID":"UM_AOUT2_CONFIG",
                        "AOUT2_STATUS":"DISABLE",
                        "AOUT2_NAME":"",
                        "AOUT2_SCALEFACTOR":'',
                        "AOUT2_OFFSET":'',
                        "AOUT2_RATE":0}

    $scope.dout1 =  {"PACKET_ID":"UM_DOUT1_CONFIG",
                        "DOUT1_STATUS":"DISABLE",
                        "DOUT1_ONLABEL":"",
                        "DOUT1_OFFLABEL":"",
                        "DOUT1_RATE":0}
    $scope.dout2 =  {"PACKET_ID":"UM_DOUT2_CONFIG",
                        "DOUT2_STATUS":"DISABLE",
                        "DOUT2_ONLABEL":"",
                        "DOUT2_OFFLABEL":"",
                        "DOUT2_RATE":0}
    
    $scope.analog = {}
    var devInfo = {};    
    $scope.wiredpoints='ai';

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
        $http.put('/api/remove/'+$scope.devId+'/'+$scope.ipAddr).success(function(result){
            if(result=='success')
                alert('Removed device Id from your list');
                $scope.getDevices();
        })
    }

    var changeStatus = function(){
        // if($scope.analog1.AIN1_STATUS)
        //     $scope.analog1.AIN1_STATUS = 'ENABLE';
        // else
        //     $scope.analog1.AIN1_STATUS = 'DISABLE';

            $scope.analog1.AIN1_STATUS ? $scope.analog1.AIN1_STATUS='ENABLE':$scope.analog1.AIN1_STATUS='DISABLE';
            $scope.analog2.AIN2_STATUS ? $scope.analog2.AIN2_STATUS='ENABLE':$scope.analog2.AIN2_STATUS='DISABLE';

            $scope.digital1.DIN1_STATUS ? $scope.digital1.DIN1_STATUS='ENABLE':$scope.digital1.DIN1_STATUS='DISABLE';
            $scope.digital2.DIN2_STATUS ? $scope.digital2.DIN2_STATUS='ENABLE':$scope.digital2.DIN2_STATUS='DISABLE';

            $scope.aout1.AOUT1_STATUS ? $scope.aout1.AOUT1_STATUS='ENABLE':$scope.aout1.AOUT1_STATUS='DISABLE';
            $scope.aout2.AOUT2_STATUS ? $scope.aout2.AOUT2_STATUS='ENABLE':$scope.aout2.AOUT2_STATUS='DISABLE';

            $scope.dout1.DOUT1_STATUS ? $scope.dout1.DOUT1_STATUS='ENABLE':$scope.dout1.AOUT1_STATUS='DISABLE';
            $scope.dout2.DOUT2_STATUS ? $scope.dout2.DOUT2_STATUS='ENABLE':$scope.dout2.AOUT2_STATUS='DISABLE';

        // if($scope.analog2.AIN2_STATUS)
        //     $scope.analog2.AIN2_STATUS = 'ENABLE';
        // else
        //     $scope.analog2.AIN2_STATUS = 'DISABLE';


    }

    $scope.connect = function(){
        // alert($scope.devId)
        changeStatus();

        $scope.analog["analog1"] = $scope.analog1;
        $scope.analog["analog2"]= $scope.analog2;

        $scope.analog["aout1"] = $scope.aout1;
        $scope.analog["aout2"]= $scope.aout2;

        $scope.analog["digital1"] = $scope.digital1;
        $scope.analog["digital2"]= $scope.digital2;

        $scope.analog["dout1"] = $scope.dout1;
        $scope.analog["dout2"]= $scope.dout2;
        
        devInfo["devId"] = $scope.devId;
        devInfo ["ipAddr"] = $scope.ipAddr;

        $scope.analog["devInfo"] = devInfo;

        $http.post('/api/wiredpoints',$scope.analog).success(function(result){
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