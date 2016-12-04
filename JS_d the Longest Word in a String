/*
功能：找到提供的句子中最长的单词，计算它的长度，并返回
输入：要查找的字符串
输入：无
返回：最长字符串长度
Author：yexinlei，2016.12.04
*/
function findLongestWord(str) {
  var maxLen = {
    "pos": 0,
    "len": 0,
  };

  var arrStr = str.split(' ');    //字符串转换为字符数组
  for (var i = 0; i < arrStr.length; i++) {
    if (arrStr[i].length > maxLen.len) {
      maxLen.pos = i;
      maxLen.len = arrStr[i].length;
    }
  }
  return maxLen.len;
}
