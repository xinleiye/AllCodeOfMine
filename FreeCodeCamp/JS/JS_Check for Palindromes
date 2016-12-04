/*
功能：如果给定的字符串是回文，返回true，反之，返回false。如果一个字符串忽略标点符号、大小写和空格，正着读和反着读一模一样，那么这个字符串就是palindrome(回文)。
输入：需要判断的字符串
输出：无
返回：true，是回文；false，不是回文。
author：yexinlei，2016.12.03
*/

function palindrome(str) {
  // Good luck!
  var mystr1 = null;
  var mystr2 = null;
  var exg = /[a-zA-Z0-9]+/gi;

  mystr1 = str.match(exg);          //匹配字符串中的大小写字母与数字，返回数组
  mystr1 = mystr1.join('');         //传入空参数，将数组转换为字符串
  mystr1 = mystr1.toLowerCase();    //不会影响字符串本身

  mystr2 = mystr1.toLowerCase();
  mystr2 = mystr2.split('');        //传入空参数，将字符串转换为数组
  mystr2 = mystr2.reverse();        //反转数组
  mystr2 = mystr2.join('');

  //alert(mystr1 + '====' + mystr2);

  if (mystr1 === mystr2) {
    return true;
  } else {
    return false;
  }
}
