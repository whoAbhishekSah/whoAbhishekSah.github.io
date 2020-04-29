var x = {a: 5};
var y = {};

var z = Object.assign(y, x);
console.log(z, y, x)
//{ a: 5 } { a: 5 } { a: 5 }