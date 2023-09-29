---
title: 'Handling shutdowns, gracefully'
date: '2023-09-29T22:12:03.284Z'
description: 'sigkill'
---

## Signals

In operating systems, signals are the messages sent by OS to the programs to notify about certain events. They are commonly used to interrupt or kill a process. Linux supports multiple signals each signifying some event. For example: when you press `CTRL+C` on a process in your terminal, `SIGINT` signal is sent to the process by OS. It's an interrupt signal to terminate the program. A more strong shutdown signal is `SIGTERM`. The most forceful of all signals is `SIGKILL`, which is an instruction to kill the program immediately. You can also send the same signals using the `kill` utility in linux. Example command: `kill -SIGINT pid` where `pid` represents the Process ID. This is useful to scenarios where you cannot `CTRL+C` a process, like a daemon. 

Signals are widely used in modern container orchestration applications like Docker, kubernetes etc. In kubernetes cluster, a user can submit request to terminate any pod, any time. Kubelet send the shutdown request to container runtime to stop the containers in the pod. This signal should be handled by the main process running inside each of the container for a graceful termination. The signal contains a grace-timeout periods as well, defaults to 30sec. Read [this](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) for more details on how kubernetes handle pod termination requests made by users.  

### Importance of handling signals

For a graceful shutdown, ideally, the developer of the program should handle the SIGINT or SIGTERM signals manually in another way handle graceful shutdowns. Typically, this would mean freeing up resources in use by the process, commiting WALs, perform cleanup etc. The steps performed in the graceful shutdown differs with the application. If the program fails to terminate with `SIGTERM`, a more forceful `SIGKILL` might come next and immediately terminate it. Depending on the type of application, this may cause data losses, partial or complete unavailability, deadlocks or inconsistency in metadata which might result in failure to reboot the process the next time. I've personally encountered the unavailability and deadlocks problems more prevalent in applications that run in some sort of cluster(quorum) and fail to handle graceful shutdown. 

For instance, Consider a scenario where we are running a cluster of 3 nodes. There is a master node which keeps the status of cluster including the two worker nodes. If a worker node terminates in the cluster and fails to inform the master node about it(i.e. ungraceful shutdown), the master node might stop taking write requests altogether in some configuration. One such configuration could be the cluster running in synchronous replication mode. That means, for a write request to be successful, all worker nodes need to send ack to master node that write was accepted. Now consider the case where a node dies ungracefully, without informing master node. For incoming write requests, Master node will wait for an ack from both nodes, but one ack never arrives within the timeout and write request is rejected eventually, resulting in partial unavailability. The read request could still be served from the master node hence not total unavailability. One can handle such scenarios in many ways - like changing the replication to synchronous to asynchronous or allow master node to poll for status etc. We can also argue if worker node had sent the termination notice to master node, master node would be in better knowledge of the cluster status and stop taking write requests altogether (if it wants to maintain a quorum) or reduce the quorum size to 2 nodes.

#### Golang example

We've seen the importance of explicitly handling signals to perform cleanup etc. The following section gives a demonstration of how to handle signals in Golang. Golang has built in signal handling packages [os/signal](https://pkg.go.dev/os/signal). 

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

For step (2): You can listen for signals on this newly created channel, forever and handle signals in a separate function. 

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
        //masterNode.notifyWorkerTermination(workerNodeId)
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

To conclude, I would say, crafting good software means giving equal importance to failure scenarios as well. You can build resilience in your program if you care about failure of your program and what happens after a failure in encountered. Signal handling is one such case developers should care about. That's all for this blog - catch you in next one. Stay tuned !
