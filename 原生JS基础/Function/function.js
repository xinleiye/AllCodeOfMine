
var add = function (num1, num2) {
/*    if (typeof num1 !== "number" || typeof num2 !== "number") {
        throw {
            name: "Error type",
            message: "add needs number"
        };
    }*/
    return num1 + num2;
};
var myObj = {
    value: 0,
    increas1: function(inc) {
        this.value += typeof inc === "number" ? inc : 1;
    },
    getValue: function () {
        return this.value;
    }
};

myObj.increas1();
//document.writeln(myObj.value);

myObj.increas1(2);
//document.writeln(myObj.value);

myObj.double = function () {
    var that = this;
    var helper = function () {
        that.value = add(that.value, that.value);
    };
    helper();
};

myObj.double();
//document.writeln(myObj.value);
//document.writeln(myObj.getValue());

var sum = add("a", "b");

function tryIt() {
    try{
        add("a", "b");
    } catch(e) {
        document.writeln(e.name + ":" + e.message);
    }
}

var haha1 = function test(i) {
    return i;
}(80)

//alert(haha1);