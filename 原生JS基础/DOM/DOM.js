//DOM基础

//Document类型
//JS通过Document表示文档类型。在浏览器中，document是HTMLDocument的一个实例
//而HTMLDocument继承自Document
//最常用的document是window的一个属性
var wDom = window.document;

//document有一个documentElement属性，指向html元素
var wHtml = wDom.documentElement;
console.log(wHtml);    //html及其下的所有子节点

//document的body属性，指向body
var wBody = wDom.body;
console.log(wBody);    //null  --->but why?

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
console.log(myNamed.namedItem("color"));

//Node类型
//DOM1定义了一个Node接口，其在JS中是作为Node类型实现的。
//JS中的所有节点类型都继承自Node类型，因此所有的都有着相同的基础属性与方法
//Node节点类型共有12种：
//
//
//
//
//
//
//
//
//
//
//
//


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