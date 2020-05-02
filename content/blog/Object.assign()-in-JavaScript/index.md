---
title: Object.assign() in JavaScript
date: '2019-12-24T22:12:03.284Z'
description: 'OBJECT Assign'
---

Object.assign() is used to assign all enumerable properties of one or more source objects to some target object.

Object.assign() is a very useful and very frequently used method in JavaScript. It takes a target object and one or more source object. It modifies the target object with several usages listed below. Source objects are never modified.

### Copying enumerable properties

```javascript
var x = { a: 5 };
var y = {};

var z = Object.assign(y, x);
console.log(z, y, x);
//{ a: 5 } { a: 5 } { a: 5 }
```

Let’s see the usage of this method from some examples:

As we can see, the variable `x` has an enumerable property a which is equal to 5. By doing an `Object.assign(y, x)` those enumerable properties of `x` will be copied to `y`. The copied object will be returned by this method.

### Overwriting common enumerable properties

Common properties of the target object will be overridden by values in source objects. Let’s see the usage of this method from some examples:

```javascript
var x = { a: 5, b: 7 };
var y = { a: 4 };

var z = Object.assign(y, x);
console.log(z, y, x);
//{ a: 5, b: 7 } { a: 5, b: 7 } { a: 5, b: 7 }
```

As we can see, the variable `x` and `y` have common property a. By doing an `Object.assign(y, x)` the common enumerable properties of the target get overridden by that of the source.

### Merging objects

This method can also be used to create new objects by merging two or more variables. For example:

```javascript
var x = { a: 1 };
var y = { b: 2 };
var z = { c: 3 };
var v = { d: 4 };
var w = Object.assign(x, y, z, v);

console.log(w, x, y, z, v);
// { a: 1, b: 2, c: 3, d: 4 } { a: 1, b: 2, c: 3, d: 4 } { b: 2 } { c: 3 } { d: 4 }
```

Although there is nothing different in the working on this method in this example, if you see it from the perspective of utility, you can use this method for merging multiple objects in one object. Here we are merging y, z, v, into a target object x.

`Object.assign()` is very important method finding it’s usage at various places.
