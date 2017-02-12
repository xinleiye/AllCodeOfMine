/*
AngularJS提供很好的依赖注入机制，以下5个核心组件用来作为依赖注入
1.value
2.factory
3.service
4.provider
5.constant
*/
var app = angular.module("myApp", []);

/*
provider创建一个service, factory
*/
app.config(function($provide){
    $provide.provider("MathService", function(){
        this.$get = function(){
            var factory = {};
            factory.multiply = function(a, b) {
                return a * b;
            };
            return factory;
        };
    });
});

/*
value是一个简单的javascript, 用于向控制器传值
*/
app.value("defaultInput", 5);

/*
factory是一个函数用于返回值
*/
app.factory("MathService", function(){
    var factory = {};
    factory.multiply = function(a, b){
        return a * b;
    };
    return factory;
});

app.service("CalcService", function(MathService){
    this.square = function(a){
        return MathService.multiply(a, a);
    };
});
app.controller("calcController", function($scope, CalcService, defaultInput){
    $scope.number = defaultInput;
    $scope.result = CalcService.square($scope.number);
    $scope.square = function(){
        $scope.result = CalcService.square($scope.number);
    };
});

/*
constant用来在配置阶段传递数值
app.constant("configParam", "constant value");
*/