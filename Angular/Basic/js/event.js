
var app = angular.module("myApp", []);

app.controller("myController", function($scope){
    $scope.count = 0;
});

app.controller("personController1", function($scope){
    $scope.firstName = "黄";
    $scope.lastName = "飞鸿";
    $scope.myStatus = false;
    $scope.toggle = function(){
        $scope.myStatus = !$scope.myStatus;
    };
});

app.controller("personController2", function($scope){
    $scope.firstName = "叶";
    $scope.lastName = "问";
    $scope.myStatus = true;
    $scope.toggle = function(){
        $scope.myStatus = !$scope.myStatus;
    };
});