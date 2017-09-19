
//继承

//原型链
/*
function SuperType() {
    this.property = false;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
};

var sup = new SuperType();
alert(sup.getSuperValue());

function SubType() {
    this.subproperty = true;
}

var sub1 = new SubType();
alert(sub1.subproperty);

//原型继承的关键，这行代码到底做了什么？
//修改了SubType的原型对象的prototype指针，使它指向SuperType
//通过修改SubType.prototype修改SubType的原型时，其实一直是在操作SuperType的一个实例

//修改了SubType原型对象中的prototype属性，使之指向SuperType
SubType.prototype = new SuperType();

//SubType.prototype.getSubValue给SubType的原型对象中添加一个方法
SubType.prototype.getSubValue = function() {
    return this.subproperty;
}

var sub2 = new SubType();
alert(sub2.getSuperValue());

//原型链的问题：
//1.引用类型被所有实例共享
//2.无法想超类型传参
*/

//借用构造函数
/*
function SuperType(name) {
    this.name = name;
}

function SubType() {
    SuperType.call(this, "Teddy_ye");
    this.age = 29;
    this.getAge = function() {
        return this.age;
    }
}

var instance = new SubType();
alert(instance.name);
alert(instance.getAge());

var instance1 = new SubType();
instance1.getAge = function() {
    alert("I'm 29 years old!");
}
alert(instance1.name);
instance1.getAge();

//借用构造函数的问题：
//1.一个实例一个方法，方法无法复用
*/

//组合继承：组合了原型链与构造继承
/*
//构造继承
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
//原型链
SuperType.prototype.sayName = function() {
    alert(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}

SubType.prototype = new SuperType();

SubType.prototype.sayAge = function() {
    alert(this.age);
}

var sub1 = new SubType("Teddy_ye", 29);
sub1.colors.push("black");
sub1.sayName();
sub1.sayAge();
alert(sub1.colors);

var sub2 = new SubType("Bob", 25);
sub2.colors.push("purple");
sub2.sayName();
sub2.sayAge();
alert(sub2.colors);
*/
//组合式继承问题：
//1.调用了两次超类构造方法


//原型式继承
/*
function object(o) {
    function F() {

    }
    F.prototype = o;
    return new F();
}

var person = {
    name: "Tom",
    friends: ["Bob", "Jucy", "Lily"],
}

var per1 = object(person);
per1.name = "Max";
per1.friends.push("Teddy_ye");

var per2 = object(person);
per2.name = "Jack";
per2.friends.push("Jane");

alert(per1.name);
alert(per1.friends);
alert(per2.name);
alert(per2.friends);

//原生Object的create()方法，与上文定义的object相似
var per3 = Object.create(person);
per3.name = "Grea";
per3.friends.push("Linda");

var per4 = Object.create(person);
per4.name = "Lilei";
per4.friends.push("Obma");

alert(per4.friends);

var per5 = Object.create(person, {
    name:{
        value: "Su"
    }
});
alert(per5.name);
*/

//寄生继承
/*
function object(o) {
    function F() {

    }
    F.prototype = o;
    return new F();
}
//original相当于宿主，sayHi增强了original
function createPerson(original) {
    var obj = object(original);
    obj.sayHi = function() {
        alert("Hello");
    }
    return obj;
}

var person = {
    name: "Gert",
    friends: ["Bob", "Tom", "Jerry"],
};

var per1 = createPerson(person);
per1.sayHi();

//寄生继承的问题：
//1.方法无法复用

//寄生组合式继承
*/

function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
    alert(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}

function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function inheritPrototype(subtype, supertype) {
    var prototype = object(supertype.prototype);
    prototype.constructor = subtype;
    subtype.prototype = prototype;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function() {
    alert(this.age);
};

var per1 = new SubType("Teddy_ye", 31);
per1.sayAge();