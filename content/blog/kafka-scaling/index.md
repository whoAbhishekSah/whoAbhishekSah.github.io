---
title: 'Horizontally scaling up a kafka cluster '
date: '2021-08-19T22:12:03.284Z'
description: 'Kafka'
---

I work in the Data Engineering team, in Gojek and my work involves managing lots of kafka clusters among other stuffs. This story is inspired from a recent outage in our kafka cluster which was causing degradation in the consumer applications. As a resort we had to scale up the kafka cluster horizontally.

Due to high load on the cluster, we were facing high CPU on few brokers. We had option to either increase the compute power on each broker simply by replacing them with powerful machine, i.e. vertical scaling. Vertically scaling a Kafka cluster means replacing existing broker nodes with higher capacity nodes while keeping the same number of brokers.

But there are a few challenges when you do that. For example, it involves careful re-consideration of the broker configs in order to optimally use the new compute power. Over-provisioning compute and storage resources to the cluster can be quite costly to the business. We didn't want to put much effort into recalibrating our broker configurations as per new machines, in favour of saving some time in a critical prod support issue. So we decide to go for horizontally scaling the kafka cluster.

Our kafka brokers are usually standard Google Compute Engine instances. The broker configurations are defined in reusable IaC modules, so that many teams can benefit from these well thought configurations. All you need to do is provision your brokers using the IaC tool. In the Data Engineering team, we heavily use Terraform for IaC provisoning.

Horizontally scaling the kafka cluster involves these rough steps:

1. Create new machines provisioning storage, networking, and compute resources
2. Start the brokers with the your chosen configurations and provisioned resources
3. Reassign partitions across the cluster so that the new brokers share the load and the cluster’s overall performance improves

Step 1 and 2 can be really challenging and tricky when you don't have a standard way of creating new machines and provisioning them with required software and configurations. In Data Engineering team we have diligently put lots of effort in acheiving these standards across any landscape of deployment be it containers or virtual machines. This gives us exponential benefits saving a lot of time, avoiding configuration drift and human errors. So here, only thing left to figure out was _reassignment of partitions_.

Before scaling up, the cluster had 6 brokers and ~1600 topics. As you might know topics are further split into partitions to load balance. Brokers store these partitions. Partitions are further replicated on various brokers. When new brokers are added, you need to manuly
