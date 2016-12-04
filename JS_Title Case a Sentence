/*
功能：确保字符串的每个单词首字母都大写，其余部分小写
输入：要替换的字符串
输入：无
返回：句子中单词首字母大写替换后的字符串
Author：yexinlei，2016.12.04
*/
function titleCase(str) {
  var arrStr = str.toLowerCase();
  var reg = /\b[a-z']+\b/g;    //正则表达式：以/开头，以/结尾。/b规则的作用：
  var myStr = null;  
  arrStr = arrStr.replace(reg, function(word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
  return arrStr;
}
