/*
功能：数组去假
输入：arr：被过滤的数组，含有各种类型的数据。argument[0]...要求过滤掉的元素
返回：过滤后的新数组
author：yexinlei，2016.12.10
*/
function destroyer(arr) {
  // Remove all the values
  var resarr = [];
  var tmparr = [];
  
  for (var i = 1; i < arguments.length; i++) {
    tmparr.push(arguments[i]);
  }
  for (var i = 0; i < arr.length; i++) {
    if (tmparr.indexOf(arr[i]) == -1) {
      resarr.push(arr[i]);
    }
  }

  return resarr;
}
