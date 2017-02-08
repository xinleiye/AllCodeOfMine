
var app = angular.module("myApp", []);

app.controller("myController1", function($scope){
    $scope.x1 = "JOHN";
    $scope.x2 = angular.lowercase($scope.x1);
});

app.controller("myController2", function($scope){
    $scope.x1 = "apple";
    $scope.x2 = angular.uppercase($scope.x1);
});

app.controller("myController3", function($scope){
    $scope.x1 = "orange";
    $scope.x2 = angular.isString($scope.x1);
});

app.controller("myController4", function($scope){
    $scope.x1 = 23123;
    $scope.x2 = angular.isNumber($scope.x1);
});