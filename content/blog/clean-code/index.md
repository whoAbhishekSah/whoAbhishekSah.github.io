---
title: 'Clean code'
date: '2019-08-04T22:13:03.284Z'
description: 'BOOK'
---

> Writing clean code is what you must do in order to call yourself a professional. There is no reasonable excuse for doing anything less than your best!

The best measurement of code quality is WTFs/minute!

So let’s get straight into actionable insights on how to reduce the above metric!

### Meaningful Names

Naming is hard! Few things to take care while naming your variables and methods.

- Use intention revealing names
- Avoid disinformation
- Make meaningful distinctions
- Use pronounceable names
- Use searchable names
- Follow common conventions of the programming language you are using
- Class names should be noun phrases
- Method names should be verb phrases ​

### Functions

- Functions should be small. 4–5 lines is a very good metric. But it is very much specific to your choice of programming language. But the lesser, the better.

- Functions should do one thing only.

- There should be only one level of abstraction per function. For example, avoid doing tasks such as inserting employee object to a list and generating the employee payslip in a single function. Because those are a different level of abstractions. Also violates the doing one thing principle.

- Avoid switch statements. Switch statements imply your function is doing more than one thing based on some condition. Think of a better way to express your thoughts(Polymorphism maybe?)

- Use descriptive names

- An optimal number of arguments to a function is zero. In the worst case, you can have one or two arguments. But more than two is a strict red alert. If a function has more than two arguments if possible make them a new class (if possible)!

- Never use flag arguments. Flag arguments mean your function is doing two things. You need to split your function.

- Don’t have side effects associated with calling your function. No hidden-changes. Clearly, do one thing!

- Return value objects. Value objects are objects whose instance variables never change once they have been set in the constructor. Value objects biggest advantage is that they save you the trouble of nonorthogonality.

- Prefer exception to return error codes. Use try-catch in place of if-else!

- DRY — Don’t Repeat Yourself! Eliminate duplication at all cost.

### Comments​

- Best comments are no comments — Comment show your inability to write clean code that expresses your intent.

### Formatting

- Indentation ​is most important.

- There shouldn’t be any blank lines in between function. A blank line should mark a logical separation in methods, classes etc.

- Instance variables should be placed at the starting of the class on top of methods.

- The caller should be above the callee. (But language-specific!)

- Focus on readability by giving appropriate vertical density.

### Objects and Data Structure​

What is the difference between Objects and Data Structure?

- Objects hide their data behind abstractions and expose functions that operate on that data.

- Objects do not expose data. Rather express their data in abstract terms.

- Data Structures expose their data and have no meaningful functions.

Sometimes we need to use data structure, sometimes we need to objects and sometimes both. So we should be able to tell

With objects, we need to follow the Law of Demeter. Law of Demeter says that a method _f_ of Class _C_ should only call methods of

- _C_

- An object created by _f_

- An object passed as an argument

- An object held as an instance variable of _C_

Failing law of Demeter implies a function knows many things. Split that function into multiple functions. It could be split into several one line functions that delegate the task to other methods.

### Error Handling

- Use exceptions rather than error codes ​

### Unit Test

- TDD is encouraged to be followed.

- Tests must be clean (Readability). Don’t treat tests as second class citizens. Your tests should also be written following all the clean code conventions. Test code is as important as production code.

- Test coverage should be always high.

- Try to have only one assertion per test. If not then try to minimize the number of assertions per test. There should be a single concept per test.

Follow the F.I.R.S.T acronym with unit tests.

F — Tests should run fast

I — Tests shouldn’t depend on each other

R — Tests should be repeatable in any environment

S — Tests should be self-validating (Test should have a boolean output)

T — Tests should be written Timely ​

### Classes​

- Never have a public variable —this implies bad encapsulation. You should protect your classes privacy from the outer world.

- Classes should be small. It should be smaller than that.

- One class should have an only responsibility — SRP: Single Responsibility Principle. SRP means a class should have only one reason to change.

- Class Name should describe what responsibility it fulfils.

- A class should have high Cohesion. Maximum cohesion is achieved when each instance variable is used by each method.

- When classes lose cohesion split them. It means SRP is being violated. Abstractions are getting mixed.

### Emergence​

- Systems that are not testable are not verifiable if not verifiable then not deployable. RUN ALL THE TESTS

- Refactoring is something which will help your system emerge. When refactoring you should remove duplication. When you refactor try to be more expressive with your intent. Impose SRP on your modules. Refactor them if SRP is being violated. ​

### Few more tips!

- Building your project(compilation, testing, packaging) should be easy. One should be able to build via a single command or a few commands only. It should bot involve various different checkpoints.

- All test should run with one command.

- Avoid multiple languages in one source file. ​

- Avoid Surprises ​

- Never overwrite Safety. This means to take care of your warnings. Simply suppressing your warnings could result in Chernobyl! A disaster.

- Eliminate duplication. Follow DRY: Don’t Repeat yourself

- Don’t Mix levels of Abstraction. Follow the law of Demeter.​

- Always remove dead code.

- Always maintain consistency ​throughout your project.

- Be as expressive as possible.​

- Don’t mix responsibilities.

- Make logical dependencies physical.
  ​
- Prefer Polymorphism to if-else, switch cases ​

- Encapsulate conditionals, boundary conditions, edges cases

---

So that was a brief summary of writing clean code.
Thanks for reading. Feel free to connect with me on [Twitter](https://twitter.com/whoAbhishekSah) for any conversations on this.
