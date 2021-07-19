---
title: Introduction to heredocs in Dockerfiles
date: 2021-07-02
description: >
  A beginner's introduction to the new heredocs feature in moby/buildkit.
---

<Columns>
<Column>

As of a couple weeks ago, Docker's BuildKit tool for building Dockerfiles now
supports [heredoc syntax](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/syntax.md#user-content-here-documents)!
With these new improvements, we can do all sorts of things that were difficult
before, like multiline `RUN`s *without* needing all those pesky backslashes at
the end of each line, or the creation of small inline configuration files.

In this post, I'll cover the basics of what these heredocs
are, and more importantly what you can use them for, and how to get started
with them! 🎉

</Column>
<Column size="one-quarter">

![](https://www.docker.com/sites/default/files/d8/2019-07/Moby-logo.png)

</Column>
</Columns>

## BuildKit (a quick refresher)

From BuildKit's [own github](https://github.com/moby/buildkit):

> BuildKit is a toolkit for converting source code to build artifacts in an
> efficient, expressive and repeatable manner.

Essentially, it's the next generation builder for docker images, neatly
separate from the rest of the main docker runtime; you can use it for building
docker images, or images for other OCI runtimes.

It comes with a lot of useful (and pretty) features beyond what the basic
builder supports, including neater build log output, faster and more
cache-efficient builds, concurrent builds, as well as a *very* flexible
architecture to allow easy extendability (I'm definitely not doing it justice).

You're either most likely using it already, or you probably want to be!
You can enable it locally by setting the environment variable
`DOCKER_BUILDKIT=1` when performing your `docker build`, or switch to using the
new(ish) `docker buildx` command.

At a slightly more technical level, buildkit allows easy switching between
multiple different "builders", which can be local or remote, in the docker
daemon itself, in docker containers or even in a Kubernetes pod. The builder
itself is split up into two main pieces, a frontend and a backend: the frontend
produces intermediate Low Level Builder (LLB) code, which is then constructed
into an image by the backend.

<Sidenote>

You can think of LLB to BuildKit as the LLVM IR is to Clang.

</Sidenote>

Part of what makes buildkit so fantastic is it's flexibility - these components
are completely detached from each other, so you can use any frontend in any
image.  For example, you could use the default Dockerfile frontend, or compile
your own self-contained [buildpacks](https://github.com/tonistiigi/buildkit-pack),
or even develop your own alternative file format like [Mockerfile](https://matt-rickard.com/building-a-new-dockerfile-frontend/).

## Getting setup

To get started with using heredocs, first [make sure you're setup with buildkit](https://docs.docker.com/develop/develop-images/build_enhancements/).
Switching to buildkit gives you a ton of out-of-the-box improvements to your
build setup, and *should* have complete compatibility with the old builder (and
you can always switch back if you don't like it).

With buildkit properly setup, you can create a new `Dockerfile`: at the top of
this file, we need to include a `#syntax=` directive. This directive informs
the parser to use a specific frontend - in this case, the one located at
[`docker/dockerfile:1.3-labs`](https://hub.docker.com/r/docker/dockerfile)
on Docker Hub.

<SidenoteWarning>

`docker/dockerfile:1.3-labs` is part of the labs channel of buildkit and so
includes support for the new heredoc syntax. However, it may not be suitable
for use in a production environment, so use your best judgement.

</SidenoteWarning>

```dockerfile
# syntax=docker/dockerfile:1.3-labs
```

With this line (which has to be the very first line), buildkit will find and
download the right image, and then use it to build the image.

We then specify the base image to build from (just like we normally would):

```dockerfile
FROM ubuntu:20.04
```

With all that out the way, we can use a heredoc, executing two commands in the
same `RUN`!

```dockerfile
RUN <<EOF
echo "Hello" >> /hello
echo "World!" >> /hello
EOF
```

## Why?

Now that heredocs are working, you might be wondering - why all the fuss? Well,
this feature has kind of, until now, been missing from Dockerfiles.

<Sidenote>

See [moby/moby#34423](https://github.com/moby/moby/issues/34423) for the
original issue that proposed heredocs in 2017.

</Sidenote>

Let's suppose you want to build an image that requires a *lot* of commands to
setup. For example, a fairly common pattern in `Dockerfile`s involves wanting to
update the system, and then to install some additional dependencies, i.e. `apt`
`update`, `upgrade` and `install` all at once.

Naively, we might put all of these as separate `RUN`s:

```dockerfile
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ...
```

But, sadly like too many intuitive solutions, this doesn't quite do what we
want. It certainly works - but we create a new layer for each `RUN`, making our
image much larger than it needs to be (and making builds take much longer).

So, we can squish this into a single `RUN` command:

```dockerfile
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ...
```

And that's what most `Dockerfile`s do today, from the official docker images
down to the messy ones I've written for myself. It works fine, images are small
and fast to build... but it does look a bit ugly. And if you accidentally
forget the line continuation symbol `\`, well, you'll get a syntax error!

Heredocs are the next step to improve this! Now, we can just write:

```dockerfile
RUN <<EOF
apt-get update
apt-get upgrade -y
apt-get install -y ...
EOF
```

We use the `<<EOF` to introduce the heredoc (just like in sh/bash/zsh/your
shell of choice), and `EOF` at the end to close it. In between those, we put
all our commands as the content of our script to be run by the shell!

## More ways to run...

So far, we've seen some basic syntax. However, the new heredoc support doesn't
just allow simple examples, there's lots of other fun things you can do.

For completeness, the hello world example using the same syntax we've already seen:

```dockerfile
RUN <<EOF
echo "Hello" >> /hello
echo "World!" >> /hello
EOF
```

<SidenoteDanger>

Just remember! Heredocs *are scripts* -- therefore, you *probably* want to exit
after the first error, instead of erroring on just the final command. To do
this, you have three options:

1. Combine all the commands using the `&&` operator - however, this is
   identical to before, and still quite nasty to read!
2. In each heredoc, use the `set -e` command to exit on first error.

    ```dockerfile
    RUN <<EOF
    set -e
    ...
    EOF
    ```
3. Set your shell to include the `-e` flag:

    ```dockerfile
    SHELL ["/bin/sh", "-e", "-c"]
    ```

My personal preference is the last option, since it requires only a single line
of your Dockerfile to change.

</SidenoteDanger>

But let's say your setup scripts are getting more complicated, and you want to
use another language - say, like Python. Well, no problem, you can connect
heredocs to other programs!

```dockerfile
RUN python3 <<EOF
with open("/hello", "w") as f:
    print("Hello", file=f)
    print("World", file=f)
EOF
```

In fact, you can use as complex commands as you like with heredocs, simplifying
the above to:

```dockerfile
RUN python3 <<EOF > /hello
print("Hello")
print("World")
EOF
```

If that feels like it's getting a bit fiddly or complicated, you can also
always just use a shebang:

```dockerfile
RUN <<EOF
#!/usr/bin/env python3
with open("/hello", "w") as f:
    print("Hello", file=f)
    print("World", file=f)
EOF
```

There's lots of different ways to connect heredocs to `RUN`, and hopefully some
more ways and improvements to come in the future!

## ...and some file fun!

Heredocs in `Dockerfile`s also let us mess around with inline files! Let's
suppose you're building an nginx site, and want to create a custom
index page:

```dockerfile
FROM nginx

COPY index.html /usr/share/nginx/html
```

And then in a separate file `index.html`, you put your content. But if your
index page is just really simple, it feels frustrating to have to separate
everything out: heredocs let you keep everything in the same place if you want!

```dockerfile
FROM nginx

COPY <<EOF /usr/share/nginx/html/index.html
(your index page goes here)
EOF
```

You can even copy multiple files at once, in a single layer:

```dockerfile
COPY <<robots.txt <<humans.txt /usr/share/nginx/html/
(robots content)
robots.txt
(humans content)
humans.txt
```

## Finishing up

Hopefully, I've managed to convince you to give heredocs a try when you can!
For now, they're still only available in the staging frontend, but they should
be making their way into a release *very* soon - so make sure to take a look
and give your feedback!

If you're interested, you can find out more from the official buildkit Dockerfile
[syntax guide](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/syntax.md).
