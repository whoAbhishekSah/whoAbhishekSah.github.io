var x = {a: 5, b: 7};
var y = {a: 4};

var z = Object.assign(y, x);
console.log(z, y, x)
//{ a: 5, b: 7 } { a: 5, b: 7 } { a: 5, b: 7 }