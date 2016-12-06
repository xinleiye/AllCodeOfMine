/*
功能：字符串包含
输入：arr：需要测试的字符串数组，含有两个元素，如果数组第一个字符串元素包含了第二个字符串元素的所有字符，函数返回true。
返回：分割完成后的字符串
author：yexinlei，2016.12.06
*/
function mutation(arr) {
  var src = "";
  var dest =  "";
  if (arr[0].length >= arr[1].length) {
    src = arr[1].toLowerCase();
    dest = arr[0].toLowerCase();
  } else {
    src = arr[0].toLowerCase();
    dest = arr[1].toLowerCase();
  }

  for (var i = 0; i < src.length; i++) {
    //String的方法：indexOf(str, s)，从s开始查找str，返回找到str的其实位置（从0开始）
    //详见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
    if ( dest.indexOf(src[i]) === -1) {
      return false;
    }
  }
  return true;
}
