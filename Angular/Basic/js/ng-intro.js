
//定义了一个名为myApp的模块
var app = angular.module("myApp", []);

//为该模块添加了一个控制器
app.controller("myCtrl", function($scope){
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});