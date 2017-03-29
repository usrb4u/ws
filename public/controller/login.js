// var app = angular.module('deviceInfo',[]);

app.controller('loginCtrl', function($scope, $http,$window,$location,commonService){


$scope.login = {};
$scope.reg={};
$scope.location = 'login';

$scope.changeLocation = function(val){
    $scope.location = val;
}

$scope.loginForm = function(){
    $http.post('/signin',$scope.login).success(function(data){
        // console.log(data);
        if(data.success){
            commonService.setLocalStorage(data);
            
            $window.location.href="/welcome";
            
        }
        else 
            alert(data.message);
    })
}

var isLoggedIn = function(){
    if(localStorage.getItem('tandev')!=undefined)
        $window.location.href='/welcome';
}

isLoggedIn();

$scope.regUser = function(){
    // console.log($scope.reg);
    var formData = {
        name:$scope.reg.name,
        email: $scope.reg.email,
        password:$scope.reg.password
    }
    if($scope.reg.password==$scope.reg.confirm){
        $http.post('/signup',formData).success(function(data){
            if(data == 'success') {
                alert('Registered Successfully');
                $scope.location = 'login';
            }else if(data=='EXIST')
                    alert('User already registered...');
            else 
                alert(data);

                
        })
    }else
    alert('Password not matching');
}

})