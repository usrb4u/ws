var app = angular.module('deviceInfo',[]);

app.service('commonService',function(){
    var commonConfig = {};
    
    this.setConfig = function(val){
        commonConfig = val;
    }
    this.getConfig = function(){
        return commonConfig;
    }
})