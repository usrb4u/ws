// var app = angular.module('deviceInfo',[]);


app.controller('wiredCtrl', function($scope, $http,$window,$location,commonService){
    $scope.userName = '';
    $scope.data = {"PACKET_ID":"UM_CONFIG"};
    $scope.analog2 =  {
                    "STATUS":"DISABLE","RATE":''}
    $scope.analog1 =  {
                    "STATUS":"DISABLE",'RATE':''}
    $scope.analog3={};
    $scope.analog4={};
    $scope.analog5={};
    $scope.analog6={};
    $scope.analog7={};
    $scope.analog8={};
    $scope.digital1 =  {}

    $scope.digital2 =  {}
    $scope.digital3={};
    $scope.digital4={};
    $scope.digital5={};
    $scope.digital6={};
    $scope.digital7={};
    $scope.digital8={};


    $scope.aout1 =  { }

    $scope.aout2 =    { }

    $scope.dout1 =  { }
    $scope.dout2 =  { };
    $scope.dout3={};
    $scope.dout4={};
    $scope.dout5={};
    $scope.dout6={};
    $scope.dout7={};
    $scope.dout8={};

    
    $scope.analog = {}
    var devInfo = {};    
    $scope.wiredpoints='ai';
    $scope.wiredsection = 'common';
    $scope.connection=false;
    $scope.localData = {};
    // console.log($rootScope.devId);
    // console.log($location.path());
    $scope.signout = function(){
        localStorage.removeItem('tandev');
        $window.location.href="/";
    }
    
    $scope.getDevices = function(){
        // $scope.localData =  JSON.parse(localStorage.getItem('tandev'))
        if(commonService.localData!=null){
            $http.defaults.headers.common['Authorization'] = commonService.localData.token;
            // $scope.userName = $scope.localData.user.name;
            $http.get('/api/getDevices/'+commonService.user.email).success(function(result){
                $scope.devList = result;
                $scope.$root.$broadcast("devInfo", {devId: $scope.devId });
            
            }).error(function(status){
            if(status== 'Unauthorized')
                commonService.signout()
            })
        }else 
        commonService.signout();
    }
    $scope.getDevices();

    

    $scope.register = function(){
        $window.location.href = '/register';
    }
    console.log(commonService.getConfig());

    $scope.remove = function(){
        // console.log(commonService.getAliasName())
        var result = confirm("Do you want to delete '"+commonService.getAliasName()+"'");
        if (result) {
            $http.put('/api/remove/'+$scope.devId+'/'+$scope.ipAddr).success(function(result){
                if(result=='success') {
                    alert('Removed device Id from your list');
                    // $scope.getDevices();
                    $window.location.href='/';
                }
            })
        }        
        
    }
    $scope.signout = function(){
        localStorage.removeItem('tandev');
        $window.location.href='/login';
    }

    var changeStatus = function(){

            $scope.analog1.STATUS==true ? $scope.analog1.STATUS='ENABLE':$scope.analog1.STATUS='DISABLE';
            $scope.analog2.STATUS==true ? $scope.analog2.STATUS='ENABLE':$scope.analog2.STATUS='DISABLE';
            $scope.analog3.STATUS==true ? $scope.analog3.STATUS='ENABLE':$scope.analog3.STATUS='DISABLE';
            $scope.analog4.STATUS==true ? $scope.analog4.STATUS='ENABLE':$scope.analog4.STATUS='DISABLE';
            $scope.analog5.STATUS==true ? $scope.analog5.STATUS='ENABLE':$scope.analog5.STATUS='DISABLE';
            $scope.analog6.STATUS==true ? $scope.analog6.STATUS='ENABLE':$scope.analog6.STATUS='DISABLE';
            $scope.analog7.STATUS==true ? $scope.analog7.STATUS='ENABLE':$scope.analog7.STATUS='DISABLE';
            $scope.analog8.STATUS==true ? $scope.analog8.STATUS='ENABLE':$scope.analog8.STATUS='DISABLE';
            $scope.data['AIN1'] = $scope.analog1;
            $scope.data['AIN2'] = $scope.analog2;
            $scope.data['AIN3'] = $scope.analog3;
            $scope.data['AIN4'] = $scope.analog4;
            $scope.data['AIN5'] = $scope.analog5;
            $scope.data['AIN6'] = $scope.analog6;
            $scope.data['AIN7'] = $scope.analog7;
            $scope.data['AIN8'] = $scope.analog8;

            $scope.digital1.STATUS==true ? $scope.digital1.STATUS='ENABLE':$scope.digital1.STATUS='DISABLE';
            $scope.digital2.STATUS==true ? $scope.digital2.STATUS='ENABLE':$scope.digital2.STATUS='DISABLE';
            $scope.digital3.STATUS==true ? $scope.digital3.STATUS='ENABLE':$scope.digital3.STATUS='DISABLE';
            $scope.digital4.STATUS==true ? $scope.digital4.STATUS='ENABLE':$scope.digital4.STATUS='DISABLE';
            $scope.digital5.STATUS==true ? $scope.digital5.STATUS='ENABLE':$scope.digital5.STATUS='DISABLE';
            $scope.digital6.STATUS==true ? $scope.digital6.STATUS='ENABLE':$scope.digital6.STATUS='DISABLE';
            $scope.digital7.STATUS==true ? $scope.digital7.STATUS='ENABLE':$scope.digital7.STATUS='DISABLE';
            $scope.digital8.STATUS==true ? $scope.digital8.STATUS='ENABLE':$scope.digital8.STATUS='DISABLE';

            $scope.data['DIN1'] = $scope.digital1;
            $scope.data['DIN2'] = $scope.digital2;
            $scope.data['DIN3'] = $scope.digital3;
            $scope.data['DIN4'] = $scope.digital4;
            $scope.data['DIN5'] = $scope.digital5;
            $scope.data['DIN6'] = $scope.digital6;
            $scope.data['DIN7'] = $scope.digital7;
            $scope.data['DIN8'] = $scope.digital8;

            $scope.aout1.STATUS==true ? $scope.aout1.STATUS='ENABLE':$scope.aout1.STATUS='DISABLE';
            $scope.aout2.STATUS==true ? $scope.aout2.STATUS='ENABLE':$scope.aout2.STATUS='DISABLE';
            $scope.data['AOUT1'] = $scope.aout1;
            $scope.data['AOUT2'] = $scope.aout2;

            $scope.dout1.STATUS==true ? $scope.dout1.STATUS='ENABLE':$scope.dout1.STATUS='DISABLE';
            $scope.dout2.STATUS==true ? $scope.dout2.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.dout3.STATUS==true ? $scope.dout3.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.dout4.STATUS==true ? $scope.dout4.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.dout5.STATUS==true ? $scope.dout5.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.dout6.STATUS==true ? $scope.dout6.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.dout7.STATUS==true ? $scope.dout7.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.dout8.STATUS==true ? $scope.dout8.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.data['DOUT1'] = $scope.dout1;
            $scope.data['DOUT2'] = $scope.dout2;
            $scope.data['DOUT3'] = $scope.dout2;
            $scope.data['DOUT4'] = $scope.dout2;
            $scope.data['DOUT5'] = $scope.dout2;
            $scope.data['DOUT6'] = $scope.dout2;
            $scope.data['DOUT7'] = $scope.dout2;
            $scope.data['DOUT8'] = $scope.dout2;

    }

    $scope.connect = function(){
        $scope.$root.$broadcast("updateDevInfo");

        console.log(commonService.getConfig());
        
        $scope.analog["common"] = commonService.getConfig();
        
        if($scope.analog["common"].DEVICE_ALIAS_NAME==null)
                $scope.analog["common"].DEVICE_ALIAS_NAME = "0";

        $http.post('/api/updateCommonConfig',$scope.analog.common).success(function(result){
            if(result=='success')
                $scope.connection=true;
            alert(result);
        })

    }

    $scope.send = function(){
        $scope.$root.$broadcast("updateDevInfo");
        changeStatus();
        console.log(commonService.getConfig());
        
        $scope.analog["common"] = commonService.getConfig();
        
        if($scope.analog["common"].DEVICE_ALIAS_NAME==null)
                $scope.analog["common"].DEVICE_ALIAS_NAME = "0";

        devInfo["devId"] = $scope.devId;
        devInfo ["ipAddr"] = $scope.ipAddr;

        $scope.analog["devInfo"] = devInfo;
        $scope.analog["data"] = $scope.data;
        // $scope.alalog["common"] =  commonServi   ce.getConfig();
        $http.post('/api/wiredpoints',$scope.analog).success(function(result){
            
            if(result=='success'){
                alert('Updated Successfully');
                $window.location.href='/';
            }else
                alert(result);
        })

        console.log($scope.analog);
    }

    $scope.changeVal = function(sec,sub){
        if($scope.wiredsection=='common' && sec=='wired')
            $scope.$root.$broadcast("updateDevInfo");
        $scope.wiredsection = sec
        $scope.wiredpoints = sub;
    }

    $scope.getAnalogInfo = function(ipAddr,devId){
        if(ipAddr=='')
            ipAddr='0.0.0.0';
        $http.get('/api/wiredAnalog/'+devId+'/'+ipAddr).success(function(result){
            if(result=='success'){
                $window.location.href='/wired/'+devId+'/'+ipAddr;
            }else
                alert(result);
        })
    }

});