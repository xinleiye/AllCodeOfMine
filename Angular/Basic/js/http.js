/*
有跨域问题，需要本地服务器保存如下内容
sites.php内容
{
    "sites": [
        {
            "Name": "菜鸟教程",
            "Url": "www.runoob.com",
            "Country": "CN"
        },
        {
            "Name": "Google",
            "Url": "www.google.com",
            "Country": "USA"
        },
        {
            "Name": "Facebook",
            "Url": "www.facebook.com",
            "Country": "USA"
        },
        {
            "Name": "微博",
            "Url": "www.weibo.com",
            "Country": "CN"
        }
    ]
}
*/
var app = angular.module("myApp", []);

app.controller("siteController", function($scope, $http){
    $http.get("http://www.runoob.com/try/angularjs/data/sites.php");
    .success(function(response){
        $scope.names = response.sites;
    });
});