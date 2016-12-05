/*
功能：数组元素删除
输入：arr要删除的数组；howMany：删除数组的前howMany个元素。
返回：数组中剩余的元素
author：yexinlei，2016.12.05
*/
function slasher(arr, howMany) {
  // it doesn't always pay to be first

  //数组的splice(s, l)方法：删除原数组中，从s开始的，l个元素
  //详见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  arr.splice(0, howMany);

  return arr;
}
