---
title: 'Troubleshooting Docker build failure'
date: '2022-09-10T22:12:03.284Z'
description: 'docker'
---

When you encounter some error in docker build, there are efficient ways of debugging it like - "Using an intermediate container to debug next commands".

For example: here is a failing build log:

```shell
Step 6/14 : ENV SCPATH /etc/supervisor/conf.d
 ---> Running in 9c0a385269cf
Removing intermediate container 9c0a385269cf
 ---> 8a773166616c
Step 7/14 : RUN apt-get -y update-all
 ---> Running in cd57fc47503d
E: Command line option 'y' [from -y] is not known.
The command '/bin/sh -c apt-get -y update-all' returned a non-zero code: 100
```

As you can see, the command on step 7 `apt-get -y update-all` has failed. We know that the command is malformed (since it's just a demo), but instead editing the command and rerunning docker build, we can check the correctness of the command in an isolated environment itself.

Step 7 uses the container with id `8a773166616c` to run the command.

We can use the same container to interactively debug what's the issue:

```
$ docker run --rm -ti 8a773166616c /bin/bash
root@464e8e35c784:/#
root@464e8e35c784:/# apt-get -y update-all
E: Command line option 'y' [from -y] is not known.

root@464e8e35c784:/# apt-get update-all
E: Invalid operation update-all

root@464e8e35c784:/# apt-get -y update
Get:1 http://security.debian.org jessie/updates InRelease [63.1 kB]
...
Reading package lists... Done
```

Once you have found the issue with the command, you can fix it in the Dockerfile.
