---
title: 'Reducing Docker Images size'
date: '2022-09-10T22:13:03.284Z'
description: 'docker'
---

Docker has become a defacto standard of building, distributing and running stateless softwares these days. Companies deploy large fleet of containers everyday via their CI/CD pipelines.

It would be interesting to look into the efficiency of docker builds mainly in terms of optimizing the size of container to make it even faster to release and download images.

### docker history

We will talk about `docker history` command here.

Let's look at a demo.

```Dockerfile
FROM fedora
RUN dnf install -y httpd
CMD ["/usr/sbin/httpd", "-DFOREGROUND"]
```

After building an image from this Dockerfile, the image size is ~466MB. In order to optimize the size, you should first look into each layers contribution in the final size.

`docker history test` will yield just that:

```
docker history test

IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
b5b5ab1ead58   5 seconds ago   CMD ["/usr/sbin/httpd" "-DFOREGROUND"]          0B        buildkit.dockerfile.v0
<missing>      5 seconds ago   RUN /bin/sh -c dnf install -y httpd # buildk…   288MB     buildkit.dockerfile.v0
<missing>      4 months ago    /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
<missing>      4 months ago    /bin/sh -c #(nop) ADD file:0ee69bd7b31ad9a58…   178MB
<missing>      5 months ago    /bin/sh -c #(nop)  ENV DISTTAG=f36container …   0B
<missing>      10 months ago   /bin/sh -c #(nop)  LABEL maintainer=Clement …   0B

```

The size of the image is 466MB. As you can see, surprisingly, `fedora` image was pulled and it was about 178MB, and the `httpd` took almost 290MB. It's way higher than the whole fedora, definitely something is not right.

As it turns out, `dnf` and other popular package manager rely on a cache that store info about all the packages that are available for installation on that platform. We can easily reduce the size by getting rid of this huge cache.

```Dockerfile
FROM fedora
RUN dnf install -y httpd && \
    dnf clean all
CMD ["/usr/sbin/httpd", "-DFOREGROUND"]
```

On building the image again, after this cached repository metadata, we get this :

```
docker history test

IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
8596a91ffcea   6 seconds ago   CMD ["/usr/sbin/httpd" "-DFOREGROUND"]          0B        buildkit.dockerfile.v0
<missing>      6 seconds ago   RUN /bin/sh -c dnf install -y httpd &&     d…   52.3MB    buildkit.dockerfile.v0
<missing>      4 months ago    /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
<missing>      4 months ago    /bin/sh -c #(nop) ADD file:0ee69bd7b31ad9a58…   178MB
<missing>      5 months ago    /bin/sh -c #(nop)  ENV DISTTAG=f36container …   0B
<missing>      10 months ago   /bin/sh -c #(nop)  LABEL maintainer=Clement …   0B
```

The new size of the image is 231 MB. We were able to get drastic size optimization.

In conclusion, `docker history` is a powerful tool that can be used to inspect the layers and how much they add up to the final size of the image. Reducing docker images size has direct implication on application distribution and deployment time.

_PS: This article was inspired from the [Docker Up and Running book](https://www.oreilly.com/library/view/docker-up/9781492036722/)_
