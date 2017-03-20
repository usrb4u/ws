

app.controller('deviceCtrl', function($scope, $http,$window,$location,commonService){

    $scope.userName = 'Srinivas';
    $scope.regDev = {};
    var devInfo={};
    $scope.common_config={"PACKET_ID":"COMMON_CONFIG_DATA",
                        "GPS_EN_STATUS":"DISABLE",
                        "DEVICEID":devInfo.deviceId,
                        "CUSTOMER_ID":devInfo.userName,
                        "DS_IPADDR":devInfo.ipAddress,
                        "DS_PORTNUMBER":1025,
                        "TS_IPADDR":$scope.serverip,
                        "TS_PORTNUMBER":21,
                        "PROTOCOL_SELECTED":'0',
                        "DATA_FORMAT": '0',
                        "DATA_XMIT_FREQ": '0', 
                        "DEVICE_ALIAS_NAME":"ALIAS_NAME", 
                        "DEVICE_CATEGORY":"WIRED_WITH_ETHERNET", 
                        "INSTALLED_LOCATION":"MARATHALLI", 
                        "PLATFORM_SUPPORTED":'0', 
                        "WIFI_NAME":"NAME", 
                        "WIFI_PASSWORD":"PASSOWORD",  
                        "DS_URL":"dweet.io", 
                        "FREEBOARD_THING_NAME":"tangent"}

    $scope.register = function(){
        $window.location.href="/register";
    }

    $scope.getDevices = function(){
        $http.get('/api/getDevices/'+$scope.userName).success(function(result){
            $scope.devList = result;
            // console.log(result);
        })
    }

    $scope.connect = function(){
        $http.post('/api/updateCommonConfig',$scope.common_config).success(function(result){
            alert(result);
        })

    }

    $scope.wiredEndpoint = function(devId) {
        // console.log($scope.common_config);
        commonService.setConfig($scope.common_config);
        console.log(commonService.getConfig());
        $http.post('/api/set_common_config',$scope.common_config).success(function(result){
            if(result=='success')
                $window.location.href='/wired/'+devId+'/0.0.0.0';
            else 
                alert(result);
        })
        
    }

    $scope.regDevice = function(){
        $scope.regDev.userName = $scope.userName;
        $http.post('/api/regDevice',$scope.regDev).success(function(result){
            if(result=='success'){
                alert('Registered Successfully');
                $window.location.href='/';
            }else if(result=='exists')
                alert('Already registered with this device id: '+$scope.regDev.devId)
            else if(result=='failed')
                alert('Unable to register. Please check Device Id');
            else
                alert(result);
            
        })
    }
    $scope.getDevices();

    $scope.getDevInfo = function(devId){
        $http.get('/api/commonPrams/'+devId).success(function(result){
            devInfo = JSON.parse(result).rec;
            devInfo['serverIP'] = JSON.parse(result).serverIP;
            $scope.common_config.DEVICEID = devInfo.deviceId;
            $scope.common_config.CUSTOMER_ID = devInfo.userName
            $scope.common_config.DS_IPADDR = devInfo.ipAddress
            $scope.common_config.TS_IPADDR = devInfo.serverIP
            if(devInfo.aliasName==null)
                $scope.common_config.DEVICE_ALIAS_NAME = "0";
            else 
                $scope.common_config.DEVICE_ALIAS_NAME = "";
        })

        // alert(devId);
    }
    

    $scope.getAnalogInfo = function(ipAddr,devId){
        if(ipAddr=='')
            ipAddr='0.0.0.0';
        
        $window.location.href = '/devparams/'+devId;
    }
    
});


