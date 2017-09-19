var person = new Object();
person.name = "Teddy_ye";
person.age = 29;
person.job = "Doctor";
person.sayName = function() {
    alert(this.name);
};

person.sayName();