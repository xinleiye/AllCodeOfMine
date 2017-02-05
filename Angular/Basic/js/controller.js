var app = angular.module("myApp", []);

/*
1.AngularJS使用$scope对象来调用控制器，$scope是一个应用对象
2.控制器的$scope(相当于作用域，控制范围)用来保存AngularJS Model的对象
3.控制器在作用域中创建了两个属性(firstName和lastName)
4.ng-model指令绑定输入域到控制器的属性
*/
app.controller("myCtrl", function($scope){
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});

/*
1.可以在控制器中添加方法(fullName)
2.可以通过表达式的方式(fullName())在HTML中调用控制器方法
*/
app.controller("personCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.fullName = function() {
        return $scope.firstName + " " + $scope.lastName;
    }
});
app.controller("namesCtrl", function($scope) {
    $scope.names = [
        {name: 'Jani', country: 'Norway'},
        {name: 'Hege', country: 'Sweden'},
        {name: 'Kai',  country: 'Denmark'}
    ];
});