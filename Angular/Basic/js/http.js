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
/*
新版本(1.6.x.x)取消了success与error方法，改用promise
*/
app.controller("siteController", function($scope, $http){
    $http.get("../php/sites.php")
    .then(function(response){
        $scope.names = response.data.sites;
        console.log(response.data.sites);
    });
});