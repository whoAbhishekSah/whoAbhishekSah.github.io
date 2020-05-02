---
title: 'TDD by Kent Beck'
date: '2019-08-04T22:14:03.284Z'
description: 'STORY'
---

> Test-driven development (TDD) is a way of managing fear during programming.

To me, this is the best reason to use TDD. Fear makes you less certain which will clearly affect what sort of code you are going to write(production or test).

Fear makes you want to communicate less. What sort of effect would it have on your program when you have a constant fear and you can’t express your intent clearly.

Let’s get started with the introduction first!

TDD is a way of programming where you write tests first then you write the actual code. Let’s see this with an example.

You want to write a method which adds two numbers and returns the output. How will you write a code for this function?

Trick question. In TDD, you don’t think of code. You think of tests first. What set of tests when passed will demonstrate the presence of code we are confident will perform addition of two numbers. Once you have decided those test cases. You write the tests and run them. Obviously, they will fail(might not even compile) because the code is not there. Then you add the minimum amount of code required to make the tests pass. Once you do that you remove the duplication that you have introduced this way.

A TDD way of writing software looks kind of like this-

1. Add a little test
2. Run all tests and fail
3. Make a little change
4. Run the tests and succeed
5. Refactor to remove duplication

This is referred to as the Red-Green-Refactor cycle, the mantra of TDD!

To make the tests pass, you might have introduced duplication. Duplication is a symptom of a problem called dependency. Duplication most often takes the form of duplicate logic — the same conditional expression appearing in multiple places in the code. Objects are excellent for abstracting away the duplication of logic. By eliminating duplication before we go on to the next test, we maximize our chance of being able to get the next test running with one and only one change. We must get rid of the duplication between the test code and the working code.

When you are at RED, you quickly want to get to GREEN. How can you do that? Kent Beck tells 3 ways of getting to green quickly. The first two are fairly simple.

- Fake It — return a constant from code and gradually replace constants with variables until you have the real code.

- Obvious Implementation — type in real implementation.

When everything is going smoothly and you know what to type(Like the addition of two numbers), you put in obvious implementation after obvious implementation (running the tests all the time to ensure that what’s obvious to you is still obvious to the computer).

As soon as you to get an unexpected red bar(not everything is as obvious as an addition), you back up, shift to faking implementations and refactor to the right code. When your confidence is back, you go back to obvious implementations.

The third way of getting to green quickly is triangulation.

- Triangulation — You Change certain important knowledge in the system and assert that the production code behaves in an accordingly expected manner. Use triangulation when you can’t see a way of eliminating duplication between code and tests. When you cannot think of what axes of variability are you trying to support in your design, make some of them vary and the answer may become clearer.

Doing clean code, you get the benefit of complete code coverage. You are confident about your design decisions. You move quickly. You don’t fear changes because you have tests that will tell you what you need to do next. You get the flexibility of easily refactoring your system because you have solid tests.

By practice, you learn to take small steps when you don’t know what is your code going to be. You take large steps when you know what your implementations are going to be. The size of your steps is dependent on the scope of the test.

TDD is very easy in many languages and testing framework such as Ruby with RSpec, even JAVA. With some langauges, TDD is tedious because of the whole Red-Green-Refactor cycle being large to handle in continuation. Experimentation also becomes tedious in such cases.

---

So that was a brief moment of ours with the book TDD by Kent Beck. Thanks for reading !!!
Feel free to connect with me on [Twitter](https://twitter.com/whoAbhishekSah) for any conversations on this.
