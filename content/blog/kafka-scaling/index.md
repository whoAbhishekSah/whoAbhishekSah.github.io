---
title: 'Horizontally scaling up a kafka cluster '
date: '2021-08-19T22:12:03.284Z'
description: 'Kafka'
---

I work in the Data Engineering team, in Gojek and my work involves managing lots of kafka clusters among other stuffs. This story is inspired from a recent outage in our kafka cluster which was causing degradation in the consumer applications. As a resort we had to scale up the kafka cluster horizontally.

Due to high load on the cluster, we were facing high CPU on few brokers. We had option to either increase the compute power on each broker simply by replacing them with powerful machine, i.e. vertical scaling. Vertically scaling a Kafka cluster means replacing existing broker nodes with higher capacity nodes while keeping the same number of brokers.

But there are a few challenges when you do that. For example, it involves careful re-consideration of the broker configs in order to optimally use the new compute power. Over-provisioning compute and storage resources to the cluster can be quite costly to the business. We didn't want to put much effort into recalibrating our broker configurations as per new machines, in favour of saving some time in a critical prod support issue. So we decide to go for horizontally scaling the kafka cluster.

Our kafka brokers are usually standard Google Compute Engine instances. The broker configurations are defined in reusable IaC modules, so that many teams can benefit from these well thought configurations. All you need to do is provision your brokers using the IaC tool. In the Data Engineering team, we heavily use Terraform for IaC provisoning.

## Process

Horizontally scaling the kafka cluster involves these rough steps:

1. Create new machines provisioning storage, networking, and compute resources
2. Start the brokers with the your chosen configurations and provisioned resources
3. Reassign partitions across the cluster so that the new brokers share the load and the cluster’s overall performance improves

Step 1 and 2 can be really challenging, time consuming, error prone and tricky when you don't have a standard way of creating new machines and provisioning them with necessary software and configurations. In Data Engineering team we have diligently put lots of effort in acheiving these standards across any landscape of deployment be it containers or virtual machines. This gives us exponential benefits saving a lot of time, avoiding configuration drift and human errors. So here, only thing left to figure out was _reassignment of partitions_.

Before scaling up, the cluster had 6 brokers and ~1600 topics. As you might know topics are further split into partitions to load balance. Brokers store these partitions. Partitions are further replicated on various brokers. When new brokers are added, you need to manually rearrange the partitions across cluster, so that the new brokers are being used to make the load even across all brokers. I've written about these concepts [here](https://abhisheksah.xyz/what-makes-kafka-awesome/) if you are intrested in a refresher.

Kafka topics are partitioned. One of the broker is elected as leader of that partition and rest brokers pariticipate in replicating that partition.

So for example: for a Topic T with replication factor 3, a parititon Pi is distributed among Broker 1 as leader, and Broker 2 and 3 as replicas.

When you run reassignment on this topic, each the partitions leader and replica will be changed.
Here is an example:

Intial partition storage view

![Before Reassignment](./before_reassignment.png)

After running parition reassignment

![After Reassignment](./after_reassignment.png)

As you can see, the partitions storage was adjusted to different brokers. At first, Partition 0 was being stored on brokers 3, 4 and 5 with 4 as the leader. After the reassignment it got stored on 1 5 and 9 with 5 as the leader.

When horizontally scaling a kafka cluster, we need to do this on all the topics, for optimal balance of load across newly added brokers.

## Execution

Now let's have a quick look at how to go about doing the reassignment.

The standard kafka installation has the rquired script to run the reassigment. It can be found as `bin/kafka-reassign-partitions.sh`.

The reassingment is a 3 step process:

1. First we put the list of topics we want to load balance, in a json file.

```json
{
  "topics": [
    {
      "topic": "test-topic"
    }
  ],
  "version": 1
}
```

2. We tell kafka cluster to generate a plan for us. This will log to console, the current partition replica assignment and proposed partition reassignment configuration

```sh
bin/kafka-reassign-partitions.sh \
--bootstrap-server "my-kafka.example.com" \
--broker-list "1,2,3,4,5,6,7,8,9" \
--topics-to-move-json-file "/root/topics.json" \
--zookeeper "my-zookeper.example.com" \
--generate
```

Put the proposed partition reassignment configuration in a json file.

3. We execute the assignment on the proposed plan.

```sh
bin/kafka-reassign-partitions.sh \
--bootstrap-server "my-kafka.example.com" \
--reassignment-json-file "/root/plan.json" \
--zookeeper "my-zookeper.example.com" \
--execute
```

The execution time depends on the size of the topic and it happens asynchronously. You can query the state of this execution by verifying.

```sh
bin/kafka-reassign-partitions.sh \
--bootstrap-server "my-kafka.example.com" \
--reassignment-json-file "/root/plan.json" \
--zookeeper "my-zookeper.example.com" \
--verify
```

## Under the hood

When a topic's partiton are reassigned, there are set of operation performed by Kafka asyncronously. Let's have a look.
