/*
功能：凯撒密码
输入：arr：需要加密的字符串
返回：加密后的字符串
author：yexinlei，2016.12.10
*/
function rot13(str) {
  // LBH QVQ VG!
  var charcode = 0;
  var charcode_A = "A".charCodeAt(0);
  var charcode_Z = "Z".charCodeAt(0);
  var res = "";

  for (var i = 0; i < str.length; i++) {
    //String.charCodeAt(pos)方法：返回一表示给定索引处字符的UTF-16代码单位值的数字；
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    charcode = str.charCodeAt(i);
    if ((charcode >= charcode_A) && (charcode <= charcode_Z)) {
      charcode = (charcode - charcode_A + 13) % 26 + charcode_A;
    }
    //String.fromCharCode(charcode)方法： 静态方法根据指定的 Unicode 编码中的序号值来返回一个字符串。通过String.fromCharCode()
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
    res = res.concat(String.fromCharCode(charcode));
  }
  return res;
}
