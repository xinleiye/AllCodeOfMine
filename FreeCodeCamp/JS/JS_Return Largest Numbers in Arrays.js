/*
功能：右边大数组中包含了4个小数组，分别找到每个小数组中的最大值，然后把它们串联起来，形成一个新数组。
输入：一个二维([n][4])的数组
输出：无
返回：每一维中最大数组成的新数组
author：yexinlei，2016.12.04
*/
function largestOfFour(arr) {
  // You can do this!
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    arr[i].sort(function (a, b) {        //将二维数组的每一维按照降序排序
      return b - a;
    });
  }

  for (i = 0; i < arr.length; i++) {     //将排好序后的数组中，每一维的第一个push到新数组中。
    result.push(arr[i][0]);
  }

  return result;
}