
var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope, $location) {
    $scope.myURL = $location.absUrl();
});

app.controller("myCtrl1", function($scope, $timeout) {
    $scope.message="Hello World";
    $timeout(function(){
        $scope.message="How are you?";
    }, 2000);
});

app.controller("myTime", function($scope, $interval) {
    $scope.nowTime = new Date().toLocaleTimeString();
    $interval(function(){
        $scope.nowTime = new Date().toLocaleTimeString();
    }, 1000);
});

/*
创建一个自定义服务：toHex
*/
app.service("toHex", function(){
    this.getHex = function(x){
        return x.toString(16);
    };
});
app.controller("myCtrl2", function($scope, toHex){
    //$scope.otc = 0;
    var er = $scope.dec;
    $scope.hex = toHex.getHex(15);
});

/*
在自定义过滤器中使用自定义服务
*/
app.filter("myFormate", ["toHex", function(toHex){
    return function(x) {
        return toHex.getHex(x);
    };
}]);
app.controller("myCtrl3", function($scope){
    $scope.counts = [255, 250, 14];
});