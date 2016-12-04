/*
功能：字符串重复num次
输入：str要重复的字符串；num：重复次数。
输出：无
返回：重复连接好长字符串
author：yexinlei，2016.12.04
*/
function repeat(str, num) {
// repeat after me
  var myStr = "";
  for(var i = 0; i < num; i++) {
    //字符串连接，将str接在myStr之后，
    //详见https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/concat
    myStr = myStr.concat(str);
  }
  return myStr;
}
