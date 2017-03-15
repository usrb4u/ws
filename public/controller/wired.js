var app = angular.module('deviceInfo',[]);


app.controller('wiredCtrl', function($scope, $http,$window,$location){
    $scope.userName = 'Srinivas';
    $scope.data = {"PACKET_ID":"UM_CONFIG_DATA"};
    $scope.analog2 =  {
                    "STATUS":"DISABLE","RATE":''}
    $scope.analog1 =  {
                    "STATUS":"DISABLE",'RATE':''}

    $scope.digital1 =  {
                        "STATUS":"DISABLE",
                        "ONLABEL":"",
                        "OFFLABEL":"",
                        "RATE":''}

    $scope.digital2 =  {
                        "STATUS":"DISABLE",
                        "ONLABEL":"",
                        "OFFLABEL":"",
                        "RATE":''}

    $scope.aout1 =  {
                        "STATUS":"DISABLE",
                        "NAME":"",
                        "SCALEFACTOR":'',
                        "OFFSET":'',
                        "RATE":''}

    $scope.aout2 =    {
                       "STATUS":"DISABLE",
                        "NAME":"",
                        "SCALEFACTOR":'',
                        "OFFSET":'',
                        "RATE":''}

    $scope.dout1 =  {
                        "STATUS":"DISABLE",
                        "ONLABEL":"",
                        "OFFLABEL":"",
                        "RATE":'0'}
    $scope.dout2 =  {
                        "STATUS":"DISABLE",
                        "ONLABEL":"",
                        "OFFLABEL":"",
                        "RATE":'0'}
    
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
            if(result=='success') {
                alert('Removed device Id from your list');
                // $scope.getDevices();
                $window.location.href='/';
            }
        })
    }

    var changeStatus = function(){

            $scope.analog1.STATUS==true ? $scope.analog1.STATUS='ENABLE':$scope.analog1.STATUS='DISABLE';
            $scope.analog2.STATUS==true ? $scope.analog2.STATUS='ENABLE':$scope.analog2.STATUS='DISABLE';
            $scope.data['AIN1'] = $scope.analog1;
            $scope.data['AIN2'] = $scope.analog2;

            $scope.digital1.STATUS==true ? $scope.digital1.STATUS='ENABLE':$scope.digital1.STATUS='DISABLE';
            $scope.digital2.STATUS==true ? $scope.digital2.STATUS='ENABLE':$scope.digital2.STATUS='DISABLE';
            $scope.data['DIN1'] = $scope.digital1;
            $scope.data['DIN2'] = $scope.digital2;


            $scope.aout1.STATUS==true ? $scope.aout1.STATUS='ENABLE':$scope.aout1.STATUS='DISABLE';
            $scope.aout2.STATUS==true ? $scope.aout2.STATUS='ENABLE':$scope.aout2.STATUS='DISABLE';
            $scope.data['AOUT1'] = $scope.aout1;
            $scope.data['AOUT2'] = $scope.aout2;

            $scope.dout1.STATUS==true ? $scope.dout1.STATUS='ENABLE':$scope.dout1.STATUS='DISABLE';
            $scope.dout2.STATUS==true ? $scope.dout2.STATUS='ENABLE':$scope.dout2.STATUS='DISABLE';
            $scope.data['DOUT1'] = $scope.dout1;
            $scope.data['DOUT2'] = $scope.dout2;

    }

    $scope.connect = function(){
        // alert($scope.devId)
        changeStatus();
        
        devInfo["devId"] = $scope.devId;
        devInfo ["ipAddr"] = $scope.ipAddr;

        $scope.analog["devInfo"] = devInfo;
        $scope.analog["data"] = $scope.data;

        $http.post('/api/wiredpoints',$scope.analog).success(function(result){
            
            if(result=='success'){
                alert('Updated Successfully');
                $window.location.href='/';
            }else
                alert(result);
        })

        console.log($scope.analog);
    }

    $scope.send = function(){
        
    }
    $scope.changeVal = function(input){
        $scope.wiredpoints = input;
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