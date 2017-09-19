/*
记忆：
memoizer函数
第一个参数memo：保存的中间值
第二个参数fundamental：调用memoizer时，传入的计算函数，如示例中的斐波那契算法

fundamental(shell, n)中的shell为 var shell = function(n){...}
*/

var memoizer = function (memo, fundamental) {
    var shell = function (n) {
        var result = memo[n];
        if (typeof result !== 'number'){
            result = fundamental(shell, n);
            memo[n] = result;
        }
        return result;
    };
    return shell;
}

var fibonacci = memoizer([0, 1], function (shell, n) {
    return shell(n-1) + shell(n-2);
});
var test = fibonacci(10);
document.writeln(fibonacci);
alert(test);
