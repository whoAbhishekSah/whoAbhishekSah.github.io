---
title: 'Golang WaitGroup'
date: '2022-02-06T22:12:03.284Z'
description: 'Golang WaitGroup'
---

Golang provides a set of concurrency primitives which helps programmers write efficient concurrent code. `WaitGroup` is one of the constructs of Golang Concurrency. Let's take a deep dive into how it works and how to best use it.

## Why use WaitGroup

`WaitGroups` are an ideal way for you to **wait** for some set of concurrent operations to complete. Example: Wait for child processes to complete before parent process exits.

Let's take a simple example.

```go
package main

import "fmt"

func greet(){
	fmt.Println("Hello")
}

func main() {
	fmt.Println("Starting main...")
	go greet()
	fmt.Println("Exiting main...")
}
```

The output of the program comes to be:

```sh
$ go run main.go

Starting main...
Exiting main...
```

In the program above, the main function is not waiting for the goroutine `greet` to finish executing. So we do not see the result on stdout from the goroutine.

### Usage

**WaitGroup** can be used here to wait for the concurrent function to complete before exiting the main.

In the modified version:

```go
package main

import (
	"fmt"
	"sync"
)

var greetWaiter sync.WaitGroup

func greet() {
	defer greetWaiter.Done()
	fmt.Println("Hello")
}

func main() {
	fmt.Println("Starting main...")
	greetWaiter.Add(1)
	go greet()
	greetWaiter.Wait()
	fmt.Println("Exiting main...")
}
```

The output you get:

```sh
$ go run main.go

Starting main...
Hello
Exiting main...
```

In the modified snippet, the noteworthy changes are:

1. We are creating a WaitGroup object `var greetWaiter sync.WaitGroup`
2. When it is time to call the goroutine we increment the adder by 1: `greetWaiter.Add(1)`
3. Until we are done with the goroutine, we want to block the execution on main. So we wait till the goroutine finishes execution: `greetWaiter.Wait()`
4. From inside the goroutine, we signal done when the goroutine finishes: `defer greetWaiter.Done()`

### Waitgroup Constructs

- `Add(n)`: Indicates to the WaitGroup, that `n` goroutines are beginning.
- `Done()`: Indicates completion of the goroutine who calls it. This is typically used with `defer`, as a part of the various clean-up actions.
- `Wait()`: Will block the function that has called `wait()`, until all the goroutines have indicated that they have exited.

### Summary

In summary, we can think of `WaitGroup` as a thread-safe counter for tracking various goroutine's execution and exit within a program.
