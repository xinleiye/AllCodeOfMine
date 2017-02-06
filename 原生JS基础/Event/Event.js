//===============事件===============
/*事件流：
按照事件的接受顺序，事件流有如下两种：
事件捕获
  document -> html -> body -> div
事件冒泡
  div -> body -> html -> document

DOM事件流：
  三个阶段：1.事件捕获；2.处于目标；3.事件冒泡
具体如下：
1.事件捕获：
  document -> html -> body
2.处于目标
  div
3.事件冒泡
  div -> body -> html -> document


事件处理程序
通过HTML特性来指定事件处理程序，此时this值为事件的目标元素，这种方式有如下三个缺点：
1.时差问题。当HTML元素显示完成时，相应的事件处理程序可能还未准备好，此时页面可能会报错
2.事件处理程序的作用域链在不同浏览器中，不尽相同
3.事件处理程序与HTML紧密耦合，修改不方便
*/
function showMessage() {
    alert("I'm from JS");	
}

//通过DOM0的方式指定事件处理程序，此时this指向事件处理程序所在的元素
(function() { 
    var doc = window.document;
    var btn = doc.getElementById("DOM0button1");
    btn.onclick = function() {
        alert("I\'m from DOM0");
    }
})();

/*
通过DOM2的方式指定事件处理程序
添加事件处理程序
addEventListener(event, handler, boolean);
  event: 要处理的事件
  handler: 处理程序
  boolean: true 在捕获阶段处理事件; false 在冒泡阶段处理事件

移除事件处理程序
removeEventListener(event, handler, boolean);
  event: 要处理的事件
  handler: 要移除的处理程序，必须与addEventListener中的handler一致，且不可为匿名函数
  boolean: true 在捕获阶段处理事件; false 在冒泡阶段处理事件
*/
(function() {
    var doc = window.document;
    var btn = doc.getElementById("DOM2button1");

    function showID() {
        alert(this.id);    //DOM2button1
    }

    function showMessage() {
        alert("I\'m from DOM2");    //I'm from DOM2
    }

    btn.addEventListener("click", showID, false);
    btn.addEventListener("click", showMessage, false);

    btn.removeEventListener("click", showID, false);
})();


/*
IE的事件处理程序
添加：attachEvent(event, handler);    //新版IE支持有问题?
移除：detachEvent(event, handler);
  event: 事件，on+事件名
  handler：事件处理程序
此时，handler中的this指向window
*/
(function() {
    var doc = window.document;
    var btn = doc.getElementById("IE_DOM2button1");

    function showThis() {
        alert(this);    //window
    }

    function showMessage() {
        alert("I\'m from IE_DOM2");    //I'm from IE_DOM2
    }

//    btn.attachEvent("onclick", showThis);
//    btn.attachEvent("onclick", showMessage);
})();



/*
DOM的事件对象
浏览器会将一个名为event的对象传入事件处理程序中
event对象的属性/方法如下：
1.bubbles
  Boolean, 事件是否冒泡
2.cancelable
  Boolean, 是否可以取消事件默认行为
3.currentTarget
  Element, 事件处理程序当前正在处理的元素
4.defaultPrevented
  Boolean, 为true表明已经调用了preventDefault()
5.detail
  Integer, 与事件相关的细节信息
6.eventPhase
  Integer, 调用事件处理程序的阶段：
           1.捕获阶段
           2.处于目标阶段
           3.冒泡阶段
7.preventDefault()
  Function, 取消事件默认行为，如果cancelable为true，则可以调用该方法
8.stopImmediatePropagation()
  Function, 取消事件的冒泡或捕获，同时阻止事件处理程序被调用
9.stopPropagation()
  Function, 取消事件的冒泡或捕获，如果bubbles为true，则可以调用该方法
10.target
  Element,  事件的目标
11.trusted
  Boolean, true: 事件由浏览器生成，false: 由开发人员通过Javascript创建
12.type
  String,  被触发的事件类型
13.view
  AbstractView, 与事件关联的抽象视图，等同于发生事件的window对象
*/
(function() {
    var doc = window.document;
    var btn = doc.getElementById("Event_button1");

    function handler(event) {
        alert(event.target);
    }
    EventUtil.addHandler(btn, "click", handler);
})();

(function() {
    var doc = window.document;
    var btn = doc.getElementById("Event_button2");

    btn.onclick = function(event) {
        alert("Clicked");
        event = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
    };
    doc.body.onclick = function(event) {
        alert("Body click");
    };
    var link = document.getElementById("myLink");
    link.onclick = function(event) {
        event = EventUtil.getEvent(event);
        EventUtil.preventDefault(event);
    };
})();

/*
UI事件
1.load
  当页面加载完成后，在window上触发
  当所有框架加载完后，在框架集上触发
  当图片加载完后，在<img>上触发
  当嵌入内容加载完毕后，在<object>上触发
2.unload
  当页面完全卸载后，在window上触发
  当所有框架卸载完后，在框架集上触发
  当嵌入的内容卸载完后，在<object>上触发
3.abort
  在用户停止下载过程时，如果嵌入的内容没有加载完，在<object>上触发
4.error
  当Javascript发生错误时，在window上触发
  当无法加载图片时在<img>上触发
  当无法加载嵌入内容时在<object>上触发
  当有一个或多个框架无法加载时，在框架集上触发
5.select
  当用户选择文本框(textarea或input)的一个或多个字符时触发
6.resize
  当框架或窗口大小发生变化时，在window上触发
7.scroll
  当用户滚动带滚动条的元素中的内容时，在该元素上触发。<body>元素包含所加载页面的滚动条
*/
