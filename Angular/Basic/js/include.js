
var app = angular.module("myApp", []);

app.controller("sitesController", function($scope){
    $http.get("sites.php").then(function(response){
        $scope.names = resopnse.data.records;
    });
});

app.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist([
        'http://c.runoob.com/runoobtest/**'
    ]);
});