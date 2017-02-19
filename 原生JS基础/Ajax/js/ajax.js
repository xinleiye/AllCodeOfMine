/*
一般一个完整的Ajax请求包含四步:

1.实例化XMLHttpRequest对象
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

2.连接服务器:open("GET", url, true)
    1).method:请求类型GET POST
    2).url:文件在服务器上的位置
    3).async:true异步，false同步

3.发送请求:send(string)
    1).string:只用于POST请求，GET请求时为空
    2).GET与POST的区别
      GET:简单，块
      POST:无法缓存；数据量大；可发送包含未知字符的用户输入

4.接收响应数据
    响应状态保存在readyState属性中，共有5种状态：
      0).请求未初始化
      1).服务器连接已建立
      2).请求已接收
      3).请求处理中
      4).请求已完成，且响应已就绪
    请求的结果保存在status中：
      1).[200,300):"OK"
      2).404:页面未找到
      3).其他：错误
    每当readState发生改变时，会触发onreadystatechange事件
    服务器返回的结果保存在如下属性中：
      1).responseText:获得字符串形式的响应数据
      2).responseXML:获得XML形式的响应数据
*/
function getRandom(fir, sec) 
{
    var ret = 0;
    var diff = fir > sec ? fir - sec : sec - fir;

    ret = Math.round( (Math.random() * diff + fir) );

    return ret;
}

function ajax(obj, callback) {

    var xhr = null;
    try {
        xhr = new XMLHttpRequest();
    } 
    catch(e) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var url = obj.url + obj.data;
    var method = obj.method;
    var async = obj.async;
    if (method === "GET") {
        url = url + "?t=" + getRandom(1000, 9999);
    } else {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ( xhr.status >= 200 && xhr.status < 300) {
                callback(xhr.responseText);
            } else {
            //dosomething
            }
        }
    };

    xhr.open(method, url, async);

    if (method === "GET") {
        xhr.send(null);
    } else {
        xhr.send(url);
    }
    
}

