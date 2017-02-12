//wmz0319
/*
包含ngRoute，作为应用的依赖
*/
var app = angular.module("routeApp1", ["ngRoute"]);

/*
Angular的config函数用来配置路由规则，
通过使用config API把$routeProvider注入到配置函数，
然后使用$routeProvider.when API用来定义路由规则
$routeProvider提供了when与otherwise函数来定义路由规则，函数有两个参数
1.url或者url正则规则
2.路由配置对象
*/
/*
路由配置对象：
$routeProvider.when(url, {
    template: string,
    templateUrl: string,
    controller: string, function 或 array,
    controllerAs: string,
    redirectTo: string, function,
    resolve: object<key, function>
});
参数说明：
1.template
当ng-view中是简单的HTML语句时可以使用
e.g. 
when("/", {template: "This is home page"})

2.templateUrl
当在ng-view中使用HTML文件时，使用
e.g.
$routeProvider.when('/computers', {
    templateUrl: 'views/computers.html',
});

3.controller
function，string或数组类型，在当前模板上的controller函数，生成新的scope

4.controllerAs
为controller制定别名

5.redirectTo
重定向的地址

6.resolve
制定controller依赖的其他模块
*/
app.config(["$routeProvider", function($routeProvider){
    $routeProvider
    .when("/", {template: "This is home page"})
    .when("/computers", {template: "This is computer page"})
    .when("/printers", {template: "This is printer page"})
    .otherwise({redirectTo:"/"});
}]);

var app2 = angular.module("routeApp2", ["ngRoute"]);

app2.controller("HomeController", function($scope, $route){
    $scope.$route = $route;
});

app2.controller("AboutController", function($scope, $route){
    $scope.$route = $route;
});

app2.config(function($routeProvider){
    $routeProvider
    .when("/home", {
        templateUrl: "embedded.home.html",
        controller: "homeController"
    })
    .when("/about", {
        tmeplateUrl: "embedded.about.html",
        controller: "aboutController"
    })
    .otherwise({
        redirectTo: "/home"
    });
});