---
title: 'REST vs HTTP'
date: '2019-08-11T22:12:03.284Z'
description: 'BLOG'
---

REST is a pretty common term that you will encounter now and then in web development. REST stands for Representational State Transfer. These are a set of core principles for architecting your software(mostly web services).

Initially introduced by Roy Fielding in his PhD dissertation, here I will try to explain in brief what those principles are, what it means to be RESTful, it’s different use cases and how HTTP comes into the picture.

Before getting into REST, we need to look at HTTP quickly. HTTP is an application layer data communication protocol on which(most of) the web works. This protocol defines how messages are formatted and transmitted and what actions web servers and browsers should take in response to various commands.

HTTP defines a set of methods to perform any action on a given resource. It has a pretty rich set of status codes which makes life way easier for a developer. There are various sophisticated features, also such as authentication, caching, cookies, etc.

So you see REST is a way of architecting your application and HTTP is the protocol which defines how your application(web services) should be built. One can think of RESTful web services as such services which follow the REST guidelines. HTTP is merely an instantiation of the REST guidelines. Your application built on top of HTTP might be perfectly RESTful, partially REST or kind of 60% REST.

It is very subjective how close is your software to being perfectly RESTful. Let’s see what should be the common characteristics in all RESTful applications.


### URIs

Every resource(objects) must be uniquely identifiable by a URI. URI stands for Uniform Resource Identifier. Objects could be anything from multimedia objects(images, videos, gifs, etc.) to text files, database rows, etc. Anything that has merits to be identifiable gets a URI. There should be a single consistent naming of the resources. Here the developer should think what the right resources in your application are.


### Linking URIs

These resources should contain links to other resources. Linking them is based on the fact that each has a unique ID. For example, you enter an address in your browser and get a web page(a resource) which links you to other resources. Representational resources link to each other.


### Uniform Interface

REST says you should have the same set of methods for all resources(uniform interface). HTTP makes this specific by its methods `GET`, `PUT`, `POST`, `DELETE`, etc. So you see these methods define what action you could perform on the resources. REST defines these in a very general context. For example GET should be safe, idempotent and cacheable on all the resources. Similarly, there are semantics associated with other methods. It is possible that we could have more such methods, maybe in some other instantiation of REST. That point is REST doesn't hold you back from having several methods on resources. But it should be consistent over the different type of resources.


### Interacting with the resources

You interact with the resource through their representation only. For example if there is a customer resource identifiable by some URI. If you `GET` it in `text/HTML` format it should return you that format, or if you get it in application/XML format, that should also work. RESTful web services allow you to interact with the same resource in different representations.


### Stateless communication

The server does not store any state about the client session. Let’s see it by an example of a shopping cart on an e-commerce website. You can add items to your cart, and you can delete items from your cart. A shopping cart can be implemented in many ways. In one implementation, the server could send a link to your shopping cart. Because it is a resource and identifiable by a URI and also it can be linked to other resources. In another implementation, the shopping cart could be an unnamed client-specific state(session state). So REST says you should go with the first one.


### Why REST?

Well, you have other options also such as GraphQL. If you follow REST guidelines, then you can derive your application-specific interface from the REST specific interface. While doing this, the developer should take care of not violating the semantics associated with the HTTP methods.

Following REST lets you decouple your application also. Your client could be anything. It can be a browser, a terminal, another apache web server, proxy, etc. The client knows what result that its action is going to produce on the resources if the server is RESTful. For example, let’s say a client is searching for some resource on the server. If you have followed REST, then you have pretty robust GET on all the resources which return a readable representation of that resource. So that will let your client build fast and efficient search algorithms.

                                            ...
                                            
Thanks for reading. The [SE-Radio Podcast with Stefan Tilkov](https://www.se-radio.net/2008/05/episode-98-stefan-tilkov-on-rest/) inspires this blog. I tried to present the learnings in a brief, concise way. Feel free to connect with me on [Twitter](https://twitter.com/whoAbhishekSah) for any conversations on this.