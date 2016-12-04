/*
功能：检查一个字符串(str)是否以指定的字符串(target)结尾。
输入：str：被检查字符串；target：匹配字符串
输出：无
返回：true，str以target结尾；false，str不是以target结尾。
author：yexinlei，2016.12.04
*/
function confirmEnding(str, target) 
{  
  // "Never give up and good luck will find you." -- Falcor  
  //substr方法：取字符串以para1起始的para2字节个子字符串；
  //详见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr
  var myStr = str.substr(0-target.length, target.length);
  if (myStr === target) {
    return true;
  } else {
    return false;
  }
}
