
var app = angular.module("myApp", []);

/*
1.AngularJS创建控制器时，可以将$scope对象当作参数传递给函数
2.当在控制器中给$scope添加属性时，视图(HTML)可以获取这些属性
3.在视图中引用属性时，不需要添加$scope前缀
*/
app.controller("myCtrl1", function($scope) {
    $scope.carname = "Volvo";
});

/*
Angular应用组成如下：
1.View(视图)，即HTML
2.Model(模型)，当前视图中可用的属性
3.Controller(控制器)，即Javascript函数，可以添加或修改属性
$scope是模型，是一个Javascript对象，带有属性和方法，这些属性和方法可以在视图和控制器中使用
*/
app.controller("myCtrl2", function($scope) {
    $scope.myName = "John Dow";
});

/*
一个控制器有一个自己的$scope
*/
app.controller("myCtrl3", function($scope) {
    $scope.names = ["Email", "Tobias", "Linus"];
});

/*
在ng-app指令包含的HTML元素中，有个公用的根作用域$rootScope，是各个controller的scope的桥梁
*/
app.controller("myCtrl4", function($scope, $rootScope) {
    $scope.names = ["Emil", "Tobias", "Linus"];
    $rootScope.lastName = "Refsnes";
});