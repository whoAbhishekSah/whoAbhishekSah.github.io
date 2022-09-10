---
title: 'Docker Containers Read Only Mount'
date: '2022-09-10T22:15:03.284Z'
description: 'docker'
---

Docker containers are best suited for stateless application. But they also provide ways to manage state externally in an efficient and reliable manner. The developers need to be cautious while using external storage with containers. Here we discuss how to use external storage and some example best practices around it.

### Docker Volumes

For application that rely on an external state, containers are not the best fit solution for deployment. If you store the state inside container, it will be lost once the container is stopped. Volumes are used for this specific reason. You can choose to store the state outside of your container, so that data remains intact even if container is stopped and removed.

**Demo**

Let's use host machine's permanent storage for storing some contents from inside a container. You can mount any directory from host machine inside the container machine.

Let's create an directory `demo` on host machine and create a text file inside it.

```
$ cd ~
$ mkdir demo
$ cd demo
$ echo "foo bar" > hello.txt
```

Now let's mount this directory in a docker container using the `-v` CLI option.

```
$ docker run --rm -ti -v ~/demo:/data: alpine:latest /bin/sh
/ # cat /data/hello.txt
foo bar
/ #
```

As you can see, we are able to access the contents of `~/demo` which is in the host machine, mounted at `/data` inside our container.

The usage patterns are:

- Any changes made inside `~/demo` directory will be visible inside container at `/data`

- Any changes made in `/data` from inside the container will be visible in `~/demo` of the host machine.

### Leveraging read-only mounts

It is also possible to mount directories as read only mode. You can do that by passing `ro` flag e.g.

```shell
docker run --rm -ti -v ~/demo:/data:ro alpine:latest /bin/sh
```

Extending on this idea, it is a good practice to mount your root volume of your container as read only mode, so that process within the container cannot write anything to the root filesystem of the container.

This way you can enforce all writes to go to the expected external storages mounted on different paths, so that the writes are not lost when container is stopped/removed.

#### Mounting root volume as read-only

The `--read-only` flag let's you enforce just that.

```
docker run --rm -ti --read-only=true -v ~/demo:/data alpine:latest /bin/sh
```

In the above scenarios, when you run `mount` you get a output like this:

```
/ # mount
overlay on / type overlay (ro,relatime,lowerdir=/var/lib/doc...)
grpcfuse on /data type fuse.grpcfuse (rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other,max_read=1048576)
```

The `/` is ro(read only) while directory mounted at `/data` is rw(read write).

In a nutshell

- Mount root filesystem of container as read only permissions
- Mount external volumes with read-write permissions

There are multiple benefits in doing this like this saves you from accidentally writing log-files(which the developer might be unaware of) in container's internal filesystem and filling up the disk space allocated to container in production.

One should also be cautious while enforcing this as this is quite restrictive. It will not allow any files to be created in `/` by any process. Your applications must adjust to this restriction accordingly.

**tmpfs**

But there is a workaround to this as well. You can have `/tmp` as writeable directory and rest of the container as read only. Use `--tmpfs` argument to mount a `tmpfs` file system into the container. Although it is ephemeral i.e. the changes will be lost when container is stopped.

Here in the example below we are launching a 256MB RW temporary storage.

```
docker run --rm -ti --read-only=true -v ~/demo:/data --tmpfs /tmp:rw,noexec,nodev,nosuid,size=256M alpine:latest /bin/sh
```

_PS: This article was inspired from the [Docker Up and Running book](https://www.oreilly.com/library/view/docker-up/9781492036722/)_
