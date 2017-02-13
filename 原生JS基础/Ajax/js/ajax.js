/*
一般一个完整的Ajax请求包含四步
1.实例化XMLHttpRequest对象
2.连接服务器
3.发送请求
4.接收响应数据
*/

function ajax() {
    //1.实例化XMLHttpRequest对象
    var httpObj = {};

    if (window.XMLHttpRequest) {
        httpObj = new XMLHttpRequest();
    } else {
        httpObj = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //2.连接服务器
    httpObj.open(method, url, async);

    //3.发送请求
    httpObj.send(string);

    /*
      4.接收响应数据
        响应状态保存在readyState属性中，共有5种状态：
          0).请求未初始化
          1).服务器连接已建立
          2).请求已接收
          3).请求处理中
          4).请求已完成，且响应已就绪
        请求的结果保存在status中：
          1).200~300:"OK"
          2).404:页面未找到
          3).其他：错误
        每当readState发生改变时，会触发onreadystatechange事件
        服务器返回的结果保存在如下属性中：
          1).responseText:获得字符串形式的响应数据
          2).responseXML:获得XML形式的响应数据
    */
    httpObj.onreadystatechange = function() {
        if (httpObj.readyState === 4 && httpObj.status === 200) {
            //dosomething
        } else if () {
            //dosomething
        } else {
            //dosomething
        }
    }
}