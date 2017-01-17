//DOM1基础
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