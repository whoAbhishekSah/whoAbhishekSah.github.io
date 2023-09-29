---
title: 'Architecting with AWS VPC'
date: '2023-09-29T22:12:03.284Z'
description: 'aws/vpc'
---

Computer networking is a fascinating concept. Networking is how you connect computers worldwide to let them communicate with each other. The computers talk to each other as per the networking rules applied to them. This article will take you through the administration of computer networks in AWS Cloud.

## VPC

A Virtual Proud Cloud(VPC) is an isolated network you can create in your AWS account, similar to a physical computer network (like LAN, etc.). It is logically isolated from other virtual networks in the AWS Cloud.

There are three essential aspects to any VPC:

1. Name of the VPC
2. Region: A VPC spans all Availability zones within the region.
3. Size: A continuous block of IP address represented using CIDR notation. CIDR notation is a mathematical way to represent blocks of IP addresses. [CIDR Ranges](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_blocks)

With these three inputs, AWS will create a network of IP addresses. The network is a virtual boundary where AWS will deploy your resources.

![Network](./network.svg)

By default, all these IP addresses are private, which means no one can access the resources from outside the network, but resources inside the boundary can access each other. The first usable IP address in this range is 192.168.0.1. We will look into architecting the VPC to create network topologies of our choice.

To allow internet connectivity to your VPC, you must create an internet gateway(IGw hereon). It's a highly available and scalable utility that allows traffic from the Internet to reach resources in your VPC. Each IGw has a unique ID in AWS.

### Subnet

A subnet is a network inside the VPC. Think of it like a chunk of the "VPC pie" shown above. It is a continuous block of networks contained inside the VPC.

For example, 192.168.0.1/26 represents a total of 64 IP addresses in the (usable)range 192.168.0.1 to 192.168.0.62

We use subnets to isolate and optimize network traffic. We can also use them to provide high availability and connectivity options for the resources. Specific privacy rules decide what traffic can get in and out of any subnet. We represent these rules as "Route Tables".

In AWS, any subnet has three significant aspects:

1. The VPC it belongs to
2. The availability zone
3. CIDR block

## Route Tables

External traffic reaches inside the VPC via an IGw. But for the traffic to get to the right resource within VPC, we must route it to the correct network(Subnet). That's where Route tables come into the picture. Route tables decide the routing of traffic within a VPC. For example, to allow traffic from IGw to a subnet, a route must exist from the IGw to the Subnet.

We classify a subnet as public or private by the type of routing table linked to it. We can apply Route tables at the subnet level or VPC level. Hence, we should place the resources that need Internet connectivity inside a public subnet. Similarly, put all resources that don't need Internet connectivity inside a private subnet.

Here is an example route table:

| Destination | Target |
| ----------- | ------ |
| 0.0.0.0/0   | igw-id |
| 10.1.0.0/16 | local  |

Any route table has no meaning unless it gets attached to a network (i.e. Subnet). Each row in this table is a route that determines where to direct traffic. The first column represents the source of the traffic, and the second column represents the medium.

So, inside the table shown above, the first row implies the following :

`0.0.0.0/0` represent traffic from any source (meaning all IP address in the universe) via the internet gateway and should be routed inside the Subnet this route table is attached to.

The second row implies that only traffic in the `10.1.0.0/16` range should be routed to the Subnet this route table is attached to. **local** is a particular target that means traffic from other subnets within the same VPC.

AWS route tables support many targets such as NAT Gateway, Network Interface, Peering connection, outpost local gateway, virtual private gateway, etc.

Each VPC has a default route table, the **Main Route Table** attached to it. The following describes the content of the Main Route table. For our VPC shown in the image above, the Main Route Table will contain the following two rows:

| Destination    | Target |
| -------------- | ------ |
| 192.168.0.1/24 | local  |
| 0.0.0.0/0      | igw-id |

AWS assumes you want traffic to move between your resources created in the VPC, making the first entry by default. The second entry specifies traffic from the Internet can reach the VPC.

## Architecting VPCs

AWS creates VPC for us in every region by default. When you create a new AWS account, you get a default VPC. Default VPCs provide a way to access the EC2 instances over the Internet properly. For your usage, you can select the default VPC or build a custom VPC on your own. The custom VPC could be more secure and provide granular options as you can control the subnets' configuration and route tables.

A default VPC has a public subnet in each Availability Zone, an internet gateway, and settings to enable DNS resolution. Therefore, you can immediately launch Amazon EC2 instances into a default VPC - designed to fast-track the simple use cases. The default VPC provisions the CIDR range, subnets and gateway for you. The following is a list of configuration AWS sets for your default VPC:

- Creates VPC of size `/16` IPv4 CIDR block (`172.31.0.0/16`). This block provides up to 65,536 private IPv4 addresses.
- Creates default subnet of size `/20` in each Availability Zone. This Subnet provides up to 4,096 addresses per Subnet. AWS reserves a few of them.
- Creates an Internet gateway and connects it to default VPC - so your VPC has Internet access by default.
- Adds a route to the main route table that points all traffic (`0.0.0.0/0`) to the internet gateway.
- Adds a route to the main route that allows inter-subnet traffic

Once you create the VPC, you should create subnets that let you decide the visibility of the IP addresses to the outside world. In the following section, we will deploy a sample application to see all the components in action.

## AWS Networking in action

Our application is a movie directory consisting of a frontend that shows a catalogue of movies in a web-based interface and a database with some movies stored along with relevant tags and metadata(such as director name, release year, genre, etc.). We want to deploy the frontend and backend on separate EC2 machines where only the frontend should be accessible from the public Internet. Let's begin with a simple organization of resources inside AWS VPC.

![VPC](vpc.svg)

At the topmost level - we have the US-east-2 region represented with two availability zones. Let's go through what we've done in the above diagram:

- We created a VPC denoted by `10.1.0.0/16` and added an Internet Gateway to it
- The VPC is split into four equal-sized subnets. Each availability zone will have two subnets, one public and one private. The Public subnets will have a custom route table associated, allowing a route from `0.0.0.0/0` via the Internet Gateway. You should place resources that must be reachable from outside the VPC inside this Subnet.
- We host two replicas of each instance(frontend, backend and database) for high availability. We disperse the replicas of each application in different availability zones. So, if an availability zone goes down, our application remains reachable to users or other services.
- We want only frontend replicas to be reachable from the Internet. Hence, we put frontend replicas inside Public Subnets. We put Backend and Database replicas inside a Private subnet. Frontend replicas can reach resources in the private Subnet with the help of route table entry `10.1.0.0/16` via the `local` target.

That's all for a basic introduction to AWS Networking. We will explore more AWS-related concepts in future blogs. Stay tuned!
