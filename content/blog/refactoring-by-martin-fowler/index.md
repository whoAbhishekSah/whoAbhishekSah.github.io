---
title: 'Refactoring by Martin Fowler'
date: '2019-08-04T22:15:03.284Z'
description: 'BOOK'
---

> Refactoring is the process of changing a software system in such a way that it does not alter the external behavior of the code yet improves its internal structure.

### Why should you care about refactoring?

Design is a pretty sloppy heuristic. No design is final. You learn about your problem by actually solving it bit by bit. You improve the design as you get to know better about what you are trying to achieve. A poorly designed system is hard to change. Hard because it is hard to figure out where the changes are needed. If it is hard to figure out what to change, there is a strong chance that the programmer will make a mistake and introduce bugs. Refactoring will make sure your design is not decaying. It will make your program adaptable to upcoming changes.

When you find that yesterday’s decision doesn’t make sense today, you change the decision. Now you can do today’s work. Tomorrow, some of your understanding as of today will seem naive, so you’ll change that, too.

You refactor as you make more sense of your decisions or when the decisions are no longer applicable.

#### A word of caution

Before we start refactoring, we should have solid tests. Solid tests only can give you 100% assurance that you didn’t break anything unknowingly while refactoring. While refactoring you must not add any features. You should not add any tests unless you find you missed one earlier. Doing refactoring you only restructure your code. Refactoring mostly changes the interface, so you might have to change tests in order to cope with a change in the interface of the code.

When you are adding a feature to your program don’t think about refactoring. Don’t think about changing existing code. You should only write your functionalities and get tests to work.

### Where can I refactor

Any place where you see a code smell, it is telling you to refactor. The phrase Code Smell was popularised by Kent Beck. Code smells are characteristic in the source code of a program that possibly indicates a deeper problem(broken window?)

So you identify the smells and fix them by the best practices of Refactoring. The author has dedicated seven chapters on what sort of smells are and what refactoring technique is best suited to handle them with proper reasoning. We will have a quick overview of smells and refactoring techniques.

Let’s Refactor!

#### Duplicated Code

This is the most common form of smell. You can apply **Extract Method** technique to make a separate method of the duplicated code. Here you take a clump of code and turns it into its own method. For example:

```java
void printOwing(double amount) {
    printBanner();
    System.out.println ("name:" + _name);
    System.out.println ("amount" + amount);
}
void printBalance(double amount) {
    printBanner();
    System.out.println ("name:" + _name);
    System.out.println ("amount" + _balance - amount);
}
```

Applying the extract method technique to this would give us

```java
void printOwing(double amount) {
    printBanner();
    printDetails(amount);
}
void printBalance(double amount) {
    printBanner();
    printDetails(_balance - amount);
}
void printDetails(double amount) {
    System.out.println ("name:" + _name);
    System.out.println ("amount" + amount);
}
```

There are many applications of the extract method technique. You can use it to make inline methods, replacing temporary variables with query methods.

#### Long Methods

A method is supposed to do one thing only. When you find a method that is doing more than one thing, it’s a smell. You need to decompose the method into several methods. You can use the above Extract Method technique or you can use Replace Temp With Query. Let’s see how Replace Temp with Query works.

```java
double calculateTotal() {
  double basePrice = quantity * itemPrice;
  if (basePrice > 1000) {
    return basePrice * 0.95;
  }
  else {
    return basePrice * 0.98;
  }
}
```

Replacing the temporary variable `basePrice` with its query method with yield.

```java
double calculateTotal() {
  if (basePrice() > 1000) {
    return basePrice() * 0.95;
  }
  else {
    return basePrice() * 0.98;
  }
}
double basePrice() {
  return quantity * itemPrice;
}
```

#### Large Class

When a class is trying to do too much, it often shows up as too many instance variables. When a class has too many instance variables, duplicated code cannot be far behind. We have seen how to deal with duplicated code. We can also split the class in two. Extract Class, Extract Subclass and Extract Interface are the refactoring techniques used when you encounter this type of smell.

#### Divergent change

Ever had a situation when a class has more than one reasons to change. This is a divergent change and a clear violation of SRP(Single Responsibility Principle). When you encounter this type of smell you need to split the class. The fundamental rule of thumb is to put things together that change together.

#### Shotgun Change

This is opposite of divergent change. When you make a kind of change(let’s say you changed your database from Postgres to MySQL) and you have to make a lot of little changes to a lot of different classes, then you have encountered this type of smell. Use Move Method, Move Field, Inline class techniques to refactor such broken windows.

#### Feature envy

Ever saw a method which calls so many methods from other classes. A method that seems more interested in a class other than the one it actually is in. Use Move Method, Extract Method, to place the method in the correct class.

#### Switch Statements

Switch statements on class types are a smell. Most times you see a switch statement you should consider polymorphism. Use Replace Type Code with Subclasses, Replace Type Code with State/Strategy or Replace Conditional with Polymorphism.

#### Middle Man

Methods that are only delegating tasks to other classes can be referred to as the middle man. Use remove Middle Man, Inline Method or Replace Delegation with Inheritance.

#### Data Class

These are classes that have fields, getting and setting methods for the fields, and nothing else. Such classes are dumb data holders and are almost certainly being manipulated in far too much. Data classes are like children. They are okay as a starting point, but to participate as a grownup object, they need to take some responsibility. Apply encapsulate field, encapsulate collection, remove setting method, move method, extract method.

There are a lot many refactoring examples in the book but I will conclude here. Thanks for reading. The book contains a lot more information on how to identify areas which need refactoring, how to refactor, what special care must be taken in particular techniques. Give it a read if you haven’t already.

---

Feel free to connect with me on [Twitter](https://twitter.com/whoAbhishekSah) for any conversations on this.
