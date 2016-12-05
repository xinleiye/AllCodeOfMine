/*
功能：数组分割
输入：arr：要分割的字符串；size：子数组长度。
返回：分割完成后的字符串
author：yexinlei，2016.12.04
*/
function chunk(arr, size) {
  // Break it up.
  var myarr = [];
  var myele = [];
  
  for (var i = 0, j = 0; i < arr.length; i += size, j++) {
    myele = arr.slice(i, i + size);
    myarr.push(myele);
  }

  return myarr;
}
