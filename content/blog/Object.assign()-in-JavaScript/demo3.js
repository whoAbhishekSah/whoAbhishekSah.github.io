var x = {a: 1};
var y = {b: 2};
var z = {c: 3};
var v = {d: 4}
var w = Object.assign(x, y, z, v);

console.log(w, x, y, z, v)
// { a: 1, b: 2, c: 3, d: 4 } { a: 1, b: 2, c: 3, d: 4 } { b: 2 } { c: 3 } { d: 4 }