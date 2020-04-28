---
title: 'JSON vs Protocol Buffer'
date: '2019-06-09T22:12:03.284Z'
description: 'BOOK'
---

#### Introduction:

Data is everywhere. Computer programs perform different operations on the data to make meaning out of them. There may be a need of data exchange among programs as well. For ex. say a mobile app(client) may ask data from an API endpoint(server) or a web server may query a database for data etc. This article is about the data exchange part.

So how can a program written in a language (say Ruby) exchange data with another program written in language (say JavaScript) over a network. We need some uniform format for data which all languages are compatible with, which all language can easily understand and parse efficiently in their data structures. We first encode the raw data in that format and serialize it, send it over the network or make it available to other programs over a network.

JSON is one such format. JSON stands for Javascript Object Notation. It’s a lightweight data interchange format. A JSON object is typically used to contain some data in key/value format. It looks like a string wrapped in curly braces with colons between the names and values, and commas between the values and names. See example below.

> {"id":"2","name":"Abhishek","message":"Read a book","time":"2200"}

Here id, name, message and time are the keys with values 2, Abhishek, Read a book and 2200 respectively. It is analogous to hash(map). The order in which these keys appear don’t matter.
A JSON Array is a collection of JSON objects wrapped in ‘[ ]’ separated by a comma. It is analogous to array. The order matters here. See example below.


> [
>>  {"id":"2","name":"Abhishek","message":"Read a book","time":"2200"},    
>>  {"id":"3","name":"Uneet","message":"Order Lunch","time":"1400"}
> ]


The JSON object and JSON arrays can be nested in each other as well. See example below.


> {
>> "room": "G75", 
>> "data": [{"id":"2","name":"Abhishek"},{"id":"3","name":"Uneet"}]
> }


JSON supports few basic data types.

* Numbers

* String

* Boolean

* Array(Ordered list)

* Object (Unordered list)


Now we know how we can represent our data in JSON. We can encode our data in our program in JSON format. Some other program may ask for this data and decode it. Mostly all programming languages now-a-days have methods in their standard libraries which perform encoding and decoding of the data with just one line of code.


Protocol Buffer is another such data-interchange format invented by Google. It is smaller, faster, and simpler than JSON and other data formats out there. JSON is a simple method to represent data. Protocol buffer introduces a schema in the data. For this we first define a (.proto) file. It contains how we want to structure our data. The first JSON object example that I stated earlier, can be given a structure in protocol buffer as given below.

> message Todo {
>>  optional int32 id = 1;
>>  required string name = 2;
>>  required string message = 3;
>>  required google.protobuf.Timestamp time = 4;
>}
Note that how we can specify data types (int32, int64, string, timestamp etc), the data labels (optional, required) in our .proto file. Each field has a unique tag. The 1, 2, 3 and 4 in the RHS are the tags to fields. The numbered tags are used to match fields when serializing and deserializing the data.

This gives much more flexibility to extract meaning out of data in an easy manner as compared to JSON. This is a pretty simple example of a proto file. Protocol Buffer have support for namespaces, enumerations as well. After defining the structure, you run the protocol buffer compiler for your application’s language on your (.proto) file to generate data access classes. They will give you simple accessor function for each field.

JSON specifies the key(field) in every object which increases the data size. Protocol buffer uses the tags to identify fields. So it’s memory efficient than JSON.

A schema is very useful in maintaining the structure of data. It counters many inconsistencies that may get introduced if structure was not defined explicitly.

Protocol Buffers have several more advantages over JSON. You can add new fields without breaking anything. Old binaries simply ignore the new field when parsing. This is called backward compatibility.

I highly recommend you to see the code samples on the [official documentation](https://developers.google.com/protocol-buffers/) of Protocol Buffers. This makes concepts really clear via code samples and working examples in many languages.
