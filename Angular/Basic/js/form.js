
var app = angular.module("myApp", []);

app.controller("formController", function($scope){
    $scope.master = {firstName: "John", lastName: "Doe"};
    $scope.reset = function(){
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();    //执行一次reset()函数
});

/*
$dirty:   表单有填写记录
$valid:   字段内容合法
$invalid: 字段内容非法
$pristine:表单无填写记录
*/

app.controller("validateController", function($scope){
    $scope.userName = "John Doe";
    $scope.email = "John.Doe@gmail.com";
});