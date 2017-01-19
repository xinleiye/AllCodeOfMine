//DOM基础

//==========Document类型==========
//JS通过Document表示文档类型。在浏览器中，document是HTMLDocument的一个实例
//而HTMLDocument继承自Document
//最常用的document是window的一个属性
(function(){

var wDom = window.document;

//documentElement属性，指向html元素
var wHtml = wDom.documentElement;
console.log(wHtml);    //html及其下的所有子节点

//document的body属性，指向body
var wBody = wDom.body;
console.log(wBody);    //body及其下的所有子元素

//title属性
var wTitle = wDom.title;
console.log(wTitle);    //DOM

//URL domain referrer属性
var wURL = wDom.URL,
    wDomain = wDom.domain,
    wReferrer = wDom.referrer;
console.log(wURL);        //浏览器标题栏中的信息
console.log(wDomain);     //域名   --->可以由紧向松改变，但不可以由松向紧转变
console.log(wReferrer);   //链接到当前页面的那个页面的URL

//查找元素
//getElementById()
var myDiv = wDom.getElementById("div1");
console.log(myDiv);    //myDiv中包含id为div1的元素及其下的所有子元素

//getElementsByTagName()
var myUl = wDom.getElementsByTagName("ul");
console.log(myUl);    //myUl为一个HTMLCollection的Nodelist，包含0个或多个元素

//getElementsByName()  namedItem()
var myNamed = wDom.getElementsByName("color");
console.log(myNamed);   //myNamed为一个HTMLCollection的Nodelist，包含0个或多个元素
//console.log(myNamed.namedItem("color"));    //只在IE下有用

//特殊集合，他们都是HTMLCollection对象
//anchors  applets  forms  images  links

//DOM检测
//implementation属性的hasFeature()方法
var hasXmlDom = wDom.implementation.hasFeature("xml", "1.0");

//文档写入，严格模式下不支持
//write()    原样写入
//writeln()    在结尾加一个换行符，这两个方法若在DOM加载完成后执行，会重写整个页面
//open()  close()    打开和关闭网页的输出流
})();


//==========Node类型==========
//DOM1定义了一个Node接口，其在JS中是作为Node类型实现的。
//JS中的所有节点类型都继承自Node类型，因此所有的都有着相同的基础属性与方法
//Node节点类型共有12种：
//Node.ELEMENT_NODE  --->1    常用重要
//Node.ATTRIBUTE_NODE  --->2
//Node.TEXT_NODE  --->3
//Node.CDATA_SECTION_NODE  --->4
//Node.ENTITY_REFERENCE_NODE  --->5
//Node.ENTITY_NODE  --->6
//Node.PROCESSING_INSTRUCTION_NODE  --->7
//Node.COMMENT_NODE  --->8
//Node.DOCUMENT_NODE  --->9    常用重要
//Node.DOCUMENT_TYPE_NODE  --->10
//Node.DOCUMENT_FRAGMENT_NODE  --->11
//Node.NOTATION_NODE  --->12


//所有节点都有的属性：
//nodeName：对于元素类节点，其值为标签名
//nodeValue：
//parentNode：指向文档树中的父节点
//firstChile：第一个子节点
//lastChild：最后一个子节点
//childNodes：保存所有子节点。是一个NodeList对象，它的length属性记录子节点个数；
//            childNodes的值随DOM结构动态变化
//previousSibling：前一个兄弟节点；第一个节点的该属性为null
//nextSiling：后一个兄弟节点；最后个节点的该属性为null
//ownerDocument：指向表示整个文档的文档节点，即文档的最顶端
//
//
//
//节点操作的方法：
//appendChild(Node)：向childNodes的最后添加一个节点Node，返回新增的节点
//insertBefore(Node1, Node2)：在节点Node2前插入一个节点Node1，返回插入的节点
//replaceChild(Node1, Node2)：使用Node1节点替换Node2节点，返回被替换的节点
//removeChild(Node)：移除节点Node，返回被移除的节点
//cloneNode(Boolean)：true，深复制，复制所有子节点；false：浅复制，只复制节点自己；
//                    该方法不会复制DOM节点中的JS属性，如事件处理程序
//normalize()：处理文本节点：删除空节点，合并多个节点为一个


//==========Element类型==========
(function(){

//HTML元素
//所有HTML元素都由HTMLElement类型表示
//id：元素在文档中的唯一标识符
//title：元素的附加说明
//lang：元素内容的语言代码
//dir：语言方向--->ltr   rtl
//className：为元素指定的CSS类，可以通过修改该属性，修改元素的样式
var doc = window.document;
var div = doc.getElementById("div1");
console.log(div.id + " " + div.title + " " + div.lang + " " + div.dir + " " + div.className);

//特性操作
//取得特性 getAttribute()
console.log(div.getAttribute("title"));

//设置特性 setAttribute()
div.setAttribute("title", "List area");
//移除特性 removeAttribute()    --->从元素中完全删除特性
div.removeAttribute("title");


//attributes    --->Element类型是使用attributes属性的唯一DOM节点

})();