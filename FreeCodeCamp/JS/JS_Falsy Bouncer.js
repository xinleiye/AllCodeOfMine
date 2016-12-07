/*
功能：数组去假
输入：arr：需要测试的数组，含有各种类型的数据。
返回：去掉假值以后的新数组，假值包含：false、null、0、""、undefined 和 NaN。
author：yexinlei，2016.12.07
*/
function bouncer(arr) {
  // Don't show a false ID to this bouncer.
  var myArr = [];
  //filter()方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组。
  //详见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  myArr = arr.filter(function(val) {
    return val || false;
    // alert(val + " " + typeof val);
    /* Those code doesn't work well;
    switch(val) {
      case null:
      case false:
      case 0:
      case "":
      case undefined:
      case NaN:
        return false;
      default:
        return true;
    }*/
  });
  return myArr;
}
