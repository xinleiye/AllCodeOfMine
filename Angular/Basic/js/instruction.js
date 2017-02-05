/*
创建自定义指令
1.使用.directive函数来添加自定义指令
2.调用时，在HTML元素上添加自定义指令名
3.使用驼峰法来命名一个指令，如runoobDirective，在使用是需要以'-'分割，runoob-directive

可以通过以下方式调用指令
1.元素名
<runoob-directive></runoob-directive>
2.属性
<div runoob-directive></div>
3.类名
<div class="runoob-directive"></div>
4.注释
<!-- directive: runoob-directive-->

限制指令的调用方式
1.E 作为元素使用
2.A 作为属性使用
3.C 作为类名使用
4.M 作为注释使用
restrict 默认值为EA, 即可以通过元素名和属性名来调用指令
*/
var app = angular.module("myApp", []);
app.directive("runoobDirective", function() {
    return {
        restrict: "EA",
        template: "<h1>自定义指令！</h1>"
    };
});