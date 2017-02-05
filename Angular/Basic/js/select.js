
var app = angular.module("myApp", []);
app.controller("myCtrl1", function($scope){
    $scope.names = ["Google", "Runoob", "Taobao"];
});

app.controller("myCtrl2", function($scope){
    $scope.sites = [
        {site: "Google", url: "http://www.google.com"},
        {site: "Runoob", url: "http://www.runoob.com"},
        {site: "Taobao", url: "http://www.taobao.com"},
    ];
});

app.controller("myCtrl3", function($scope){
    $scope.sites = {
        site01: "Google",
        site02: "Runoob",
        site03: "Taobao",
    };
    $scope.cars = {
        car01: {brand: "Ford", model: "Mustang", color: "red"},
        car02: {brand: "Fiat", model: "500", color: "white"},
        car03: {brand: "Volov", model: "XC90", color: "black"},
    };
});