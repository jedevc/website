---
title: "Shell from Scratch"
date: 2020-06-17
description: >
  Build a shell entirely from scratch in a few hours!
---

Welcome! If you're looking for a project for over the weekend, or something a
bit more tricky than your standard tutorial, or just looking to brush up a
bit on your Go or Linux knowledge, this is the series for you!

In the next few posts, we're gonna build a classic UNIX-style shell -
entirely from scratch. Why? Well, shells are at the core of how developers,
hackers, sysadmins and loads of other people interact with a computer. And
yet, most people don't really know the internals of *how* they work.

This, to me, seems kinda strange - shells aren't that complicated, when you
get down to it. That's a bit of an exaggeration: shells are often very
complex, with hundreds and thousands of lines of code dedicated to **very
complex** signal management, job control, security considerations, etc. But,
if you get rid of all the extra bits, you're left with a core that's actually
quite easy to understand and implement.

And understand it we will! We're going to go through and write the entire
codebase line by line, with plenty of explanations. For your convenience,
I've broken everything up into multiple chapters - each chapter will be
dedicated to a single feature (or a set of related features). By the end of
each chapter, you should have a working shell, there's no half-working,
broken functionality here.

When I set out to write this series, I set myself a number of interesting
goals.

- First off, I wanted to use Go. It's cool and popular, but also it's
similar enough to C, to allow us to get an "authentic" unix shell
implementation, which I don't think we would get in a language like Python.
- Secondly, I wanted everything to fit into 1000 lines. Quite a trick, and to
do it, we take a few shortcuts, but it keeps everything understandable and
allows us to focus on just the important functionality.
- Finally, I didn't want to use any third-party dependencies. This was more
of a practical choice - I think it's important to understand all the
components in a tutorial of any kind without hand-waving the details with
other libraries that do all the work.

I highly, highly recommend that you follow along with the code, and type it
out as you go; but if you're not in the mood, then don't worry - you'll still
be able to learn a lot just by seeing what code I've managed to spew out.

So without further ado, let's get stuck in!

## Chapters

0. [Chapter 0](chapter-0) - The Correct Place to Start
1. [Chapter 1](chapter-1)

