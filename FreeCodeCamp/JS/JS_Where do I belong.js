/*
功能：数组查找
输入：arr：要处理的数组，只含有数字。num：需要插入查找的元素
返回：插入元素在新数组中的位置
author：yexinlei，2016.12.10
*/
function where(arr, num) {
  // Find my place in this sorted array.
  var pos = 0;
  arr.push(num);
  arr.sort(function(a, b){
    return a - b;
  });
  pos = arr.indexOf(num);
  return pos;
}
