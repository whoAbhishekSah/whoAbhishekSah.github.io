---
title: 'Handling shutdowns, gracefully'
date: '2023-09-29T22:12:03.284Z'
description: 'sigkill'
---

## Signals

In operating systems, signals are the messages OS sends to the programs to notify about specific events. They are commonly used to interrupt or kill a process. Linux supports multiple signals, each signifying some event. For example, when you press `CTRL+C` on a process in your terminal, a `SIGINT` signal is sent to the process by OS. It's an interrupt signal to terminate the program. A more strong shutdown signal is `SIGTERM`. The most forceful of all signals is `SIGKILL`, an instruction to kill the program immediately. You can also send the same signals using the `kill` utility in Linux. This utility is useful when you cannot `CTRL+C` a process, like a daemon. Example command: `kill -SIGINT pid` where `pid` represents the Process ID. `

Modern container orchestration applications like Docker and Kubernetes use signals widely. In the Kubernetes cluster, a user can submit a request to terminate any pod at any time. Kubelet sends the shutdown request to container runtime to stop the containers in the pod. The main process inside each container should handle this signal for a graceful termination. This signal also contains a grace timeout period and defaults to 30 seconds. Read [this](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) for more details on how Kubernetes handles pod termination requests made by users.  

### Importance of handling signals
For a graceful shutdown, the program developer should ideally handle the SIGINT or SIGTERM signals manually. Typically, this would mean freeing up resource use by the process, committing WALs, performing cleanup, etc. The steps performed in the graceful shutdown differ with the application. If the program fails to terminate with `SIGTERM`, a more forceful `SIGKILL` might come next and immediately terminate it. Depending on the type of application, this may cause data losses, partial or complete unavailability, deadlocks or inconsistency in metadata, which might fail to reboot the process the next time. I've encountered the unavailability and deadlock problems more prevalent in applications that run in some cluster(quorum) and fail to handle graceful shutdown. 

For instance, Consider a scenario where we are running a cluster of 3 nodes. There is a Master node that keeps the status of the cluster, including the two secondary nodes. Suppose a secondary node terminates in the cluster and fails to inform the Primary node about it(i.e. ungraceful shutdown). In that case, the Primary node might stop taking write requests altogether in some configuration. One such configuration could be the cluster running in synchronous replication mode. For any Write request to be successful, all secondary nodes must acknowledge the Primary node that the Write was accepted. Now consider the case where a secondary node dies ungracefully without informing the Primary node. The Primary node will wait for an ack from both nodes for incoming Write requests. Still, one ack never arrives within the timeout, so the primary node rejects the Write requests, resulting in partial unavailability. The primary node can continue serving the read requests; hence, it's not 100% unavailability. One can handle such scenarios in many ways - like changing the replication from synchronous to asynchronous or allowing the Primary node to poll for status, etc. We can also argue if the secondary node had sent the termination notice to the primary node, the primary node would have better knowledge of the cluster status and stop taking write requests altogether (if it wants to maintain a quorum) or reduce the quorum size to 2 nodes.

#### Golang example

We've seen the importance of explicitly handling signals to perform cleanup. The following section gives a demonstration of how to handle Signals in Golang. Golang has built-in signal handling packages [os/signal](https://pkg.go.dev/os/signal). 

There are two parts to handle graceful shutdown: 
1. Notifying our program for the signal received
2. Performing cleanup/shutdown tasks 

For step (1): Golang runtime can notify the program for signals received on a signal channel.

```go
import "os/signal"

..
..

signalChannel := make(chan os.Signal, 1)
signal.Notify(signalChannel)

```

For step (2): You can listen for signals on this newly created channel forever and handle Signals in a separate function.  

```go
import (
    "os"
    "os/signal"
    "syscall"
)

// example handler function that ignores 
// all signals except SIGTERM
func handler(signal os.Signal) {
	if signal == syscall.SIGTERM {   //SIGTERM received
        //masterNode.notifysecondaryTermination(secondaryNodeId)
		os.Exit(0)
	}
}

func main(){
    signalChannel := make(chan os.Signal, 1)
    signal.Notify(signalChannel)

    go func() {
		for {
			s := <-signalChannel
			handleSignal(s)
		}
	}()
}
```

To conclude, crafting good software means giving equal importance to failure scenarios. You can build resilience in your program if you care about the failure modes of your program and what happens after a failure is encountered. Signal handling is one such case developers should care about. That's all for this blog - catch you in the next one. Stay tuned!