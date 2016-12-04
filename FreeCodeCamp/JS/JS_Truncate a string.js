/*
功能：字符串截断
输入：str要重复的字符串；num：重复次数。
输出：无
返回：
1.若str.length <= num, 直接返回
2.若str.length < num
    2.1.若num <= 3，则截取num个子字符，尾部连接...，并返回
    2.2.若num > 3，则截取num - 3个子字符，尾部连接...，并返回
author：yexinlei，2016.12.04
*/
function truncate(str, num) {
  // Clear out that junk in your trunk
  var endSlice = 0;
  var myStr = "";

  if (str.length <= num) {
    return str;
  }

  if (num <= 3) {
    endSlice = num;
  } else {
    endSlice = num - 3;
  }
  //String.slice(s, e)方法：提取字符串中从s开始(含)，e结束(不含)之间的字符串
  //详见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/slice
  myStr = str.slice(0, endSlice);  myStr = myStr.concat("...");
  return myStr;
 }
