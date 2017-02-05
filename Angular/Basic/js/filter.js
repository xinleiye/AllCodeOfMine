var app = angular.module("myApp", []);

/*
1.AngularJS可用于转换数据
过滤器     描述
currency:  格式化数字为货币格式
filter  :  从数组中选择一个子项
lowercase: 格式化字符串为小写
orderBy :  根据某个表达式排列数组
uppercase: 格式化字符串为大写

2.表达式中添加过滤器
过滤器可以通过一个管道字符(|)和一个过滤器添加到表达式中
*/
app.controller("myCtrl", function($scope){
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});

app.controller("costCtrl", function($scope) {
    $scope.quantity = 1;
    $scope.price = 9.99;
});

app.controller("namesCtrl", function($scope) {
    $scope.names = [
        {name: 'Jani', country: 'Norway'},
        {name: 'Hege', country: 'Sweden'},
        {name: 'Kai',  country: 'Denmark'}
    ];
});