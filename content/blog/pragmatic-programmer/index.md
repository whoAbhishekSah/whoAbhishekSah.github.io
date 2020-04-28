---
title: 'Pragmatic Programmer'
date: '2019-08-04T22:12:03.284Z'
description: 'BOOK'
---

A great book for anyone who wants to become a more effective and productive programmer! This book contains great tips on how to be one!


### What is pragmatic, you may ask!

Being pragmatic is all about being skilled in business, caring about your craft. Skill and craft come from experience. It comes from facing failures, learning things and not being afraid of them. Take this to the field of programming.

What makes a pragmatic programmer?

Pragmatic programmers are fast adopters. They are always inquisitive — asking lots and lots of questions. They are critical thinkers. They don’t operate on auto-pilot. They are the jack of all trades.

They take responsibilities. They don’t make lame excuses. When they make a mistake they accept it and provide options. They don’t play the blame game. They don’t live with broken windows(a bad design decision, poor code etc.)

They invest in their knowledge portfolio every day. They keep on diversifying the knowledge portfolio.

                                                    ...

### A Pragmatic approach!

There are some ideas which apply to almost every type of software development. A set of ideas and processes which help you build better software.

## Duplication

Duplication is the root cause of all evil. Duplicated logic is hard to deal with. It’s hard to refactor. It is a broken window. We fix all the broken windows. There could be various causes of duplication arising. It could be because of multiple representations of information, comments, language issues. It could have arisen from mistakes in design. Taking shortcuts because of lack of time mostly results in duplications. Remove duplications at all costs. Follow DRY: Don’t Repeat Yourself!

## Orthogonality

Two or more things are orthogonal if a change in one doesn’t affect the other. We want to design components that are self-contained, independent and with a single well-defined purpose. You get a lot of benefits from orthogonality. By promoting orthogonality, you are promoting reusability, which in turn makes you productive. Orthogonality applies to code, to design and even teams. We should maximize orthogonality. Make your module easy to reuse.

## Reversibility

One thing you should always keep in mind is that there are no final decisions. Make your software architecture flexible. Make it easy to accommodate changes. In an object-oriented way of programming, you can achieve this with low coupling, good encapsulation.

## Tracer Bullets

Use tracer bullets to find you want to achieve. The tracer bullet method involves implementing a new application end-to-end to test every layer or component’s interaction. They are preferred to the labour of calculation. Using tracer bullets users get to something working very quickly. Developers build a structure to work in. You have an integration platform. You have something to demonstrate. You have a better feel for progress.

## Prototype

Anything that you are not comfortable with could be prototyped. You can prototype architecture, new functionality, third party tools or UI design. Prototyping could be done in several ways. Prototyping is a learning experience. You build some disposable product, maybe using a totally different technology stack from the original product. You learn what you want to build using prototypes.

                                                    ...

### Basic Tools!

Every craftsman needs a good set of tool to be productive and carry out the job effectively. For a programmer, these are some of the basic tools that you need to get comfortable with :

Up your shell game. Shell commands make you highly productive. Compare that to the GUI way of doing it and you will find out. Learn the shell commands and use them. The more you use them, the better you get at it. I have found stream editor(sed) magical. Exploiting the benefits of pipelines, redirection & composability, you can bring wonders through one single command.

Use a single editor well. Learn all the shortcuts and keymaps that you need to apply every moment. Vim vs VSCode should not be an argument. Whatever gets your job done and makes you productive, go for it.

Always use source code control. Git is the best(my opinion 😝 )!

Develop debugging psychology. Don’t panic when an error popups. While debugging, don’t assume something, rather prove it. This will save you from the trouble of blaming the system for a fault that is likely to be your own (select isn’t broken!).

                                                        ...

### Pragmatic Paranoia!

Accept the fact that you can’t write perfect software. Because it doesn’t exist. No one writes perfect software. You should be convinced of the fact that you also don’t write perfect software. Pragmatic Programmers code in defences against their own mistakes. Here are some defensive measures that you can take.

## Design by Contract

Bertrand Meyer came up with this elegant concept. Before a function starts, it may have some expectation of the state of the world, and it may be able to make a statement about the state of the world when it concludes. Its a contract between a function and any potential caller:

    If all the routine’s preconditions are met by the caller, the routine shall guarantee that all postconditions and invariants will be true when it completes.

When you design by contract you be strict in what you will accept before you begin and promise as little as possible in return.

## Crash Early

When you follow DBC(Design by Contract), it’s much easier to find and diagnose the problem by crashing early, at the site of the problem. You can easily found out where was the breach of contract. This way you will avoid any surprising results.

## Assertive Programming

The idea is that “if it can’t happen, use assertions to ensure that it won’t.” Assertions check for things that should not happen. Assertions will save the day when you hit an error as silly as array being null, the string being empty, array not sorted etc.

## Exception Handling

Use exceptions but don’t abuse your program in a messy unexceptional way. Use exceptions for exceptional problems. Something being exceptional depends on the context. A FileNotFound could qualify as an exception when you are expecting it should have been there. But when you are not sure whether the file should be there, raising an error seems an appropriate response.

## Resource Handling

Many of the time we forget to close the file we opened to write. This could hit us in pretty serious problems when scaled. Always have a consistent plan to deal with resource allocation and deallocation.

                                                    ...

### Bend or Break

Your program should be flexible and adaptable in the face of an uncertain world. How can you achieve that?

## Law of Demeter

Uncle Bob martin describes the law of Demeter as below:

A method f of Class C should only call methods of

* C

* An object created by f

* An object passed as an argument

* An object held as an instance variable of C

What happens when you don’t follow the law of Demeter? You end up having lots of coupled classes. This will restrict your flexibility. Orthogonality will be compromised. So follow the law of Demeter. Organise your code into modules and limit the interaction between them.

## Metaprogramming

The systems that we are trying to build should be highly configurable. Use metadata to describe configuration options for an application. Switching communication port should be better done via configuration than getting into the coding details. We should appreciate the values of metaprogramming.

## Temporal coupling

There are various things in our day to day life which can be made concurrent. So are in software. Many of the tasks don’t depend on each other, so executing them concurrently can give a great deal of performance improvement. Temporal coupling is about analyzing workflow to find and improve concurrency.


                                                ...



### While you are coding

Some advice on how you should code and how you should not!

## Program by Coincidence

Ever faced the situation when you don’t know why the code is failing because you didn’t know why it worked in the first place. It seemed to work, given the limited “testing” that you did, but that was just a coincidence. I had many of these moments. So code deliberately. Proceed with a plan, always be aware of what you are doing and document your assumptions.

## Estimating algorithm speed

Estimate the runtime of your algorithm. A Big-O analysis of your codebase would help you identify major areas of improvement in terms of computation.

## Refactoring

Refactoring is a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behaviour. We refactor to make sure our program is not rotting. You should refactor when you see a violation of the DRY principle. When you see nonorthogonality try to refactor to the best possible extent. Remove outdated knowledge from the codebase. Refactor early, refactor often.

## Testing

A lot has been said and discussed on testing. You should write proper unit tests. Testing is more cultural than technical. It’s language and framework independent. Create a culture of testing.


                                                        ...


### Before the project

Most of the times when a project starts, requirements are not locked. Requirements are never fixed. They keep evolving as the customer and the developer get closer to understanding what they want to consume/build. Most of the times we need to dig for requirements by having one on one sessions with the consumer to identify the expectations rigidly.
Promote abstractions. Talk in terms of abstractions because abstractions live longer than the implementations.


                                                        ...

So that was a brief summary of what makes a pragmatic programmer. I have started to adopt these pieces of advice as I care more of my craft now than ever.

Thanks for reading !!! Feel free to connect with me on [Twitter](https://twitter.com/whoAbhishekSah) for any conversations on this.