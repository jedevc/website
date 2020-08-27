---
title: "Shell from Scratch - Chapter 0"
date: 2020-06-17
description: >
  Shell from Scratch (Chapter 0 - The Correct Place to Start)
hidden: true
---

Before we can properly get started, we're going to get the absolute basics
sorted, and make sure we can compile something that looks a bit shell-like
(with none of the actual behaviour). We're also going to look a bit more into
what makes a shell a shell.

## Prerequisites

For this series, unfortunately, it's super important that we use some UNIX
variant - I'll be on Linux.

Why? What stops us using other systems like Windows? Doesn't Go support
Windows?

Yes, it does. However, Windows isn't UNIX (surprise, surprise). So while the
code we write will (or should) run on Windows, the shell won't really work as
intended. The shell is at the core of the Unix philosophy of small, minimal
programs - the shell is the process that connects these parts together. But
on Windows, these small parts don't really exist in the same way, so the
shell is kinda pointless.

On your wonderful Unix-y Operating System, we then need to [install go](https://golang.org/doc/install).
I won't include instructions here, the official go website has pretty good
ones already which you can use if you don't have it already.

## What shells do

The shell is "glue" software - it sticks other programs together. A typical
UNIX system might have thousands of unique programs sitting around. The job
of the shell is to stitch these all together, by typing commands into a
prompt.

We can have our shell of choice invoke the "ls" program to count our
installed programs in /usr/bin (other bin directories *are* available):

	$ ls /usr/bin | wc -l
	302

<Sidenote>

TODO: notes on other bin directories

</Sidenote>

This simple command illustrates the true flexibility of a shell over
something like a point-and-click interface. We use `ls` to list some files,
then *pipe* it into `wc` to count the number of files. We don't need a new
command to count the number of files, we just compose existing commands
together to make new ones.

There are many different implementations of shells out there - bash, zsh,
fish, cmd, powershell, etc, etc. You interact with all of them by typing in
commands, which then execute different programs around your system.

You can see where different programs live with the `which` program:

	$ which ls
	/usr/bin/ls
	$ which wc
	/usr/bin/wc

<Sidenote>

How about `which which`? Hehe.

The result you get depends on the shell that you're using. For example, on
bash, we get `/usr/bin/which` - what we'd expect. On zsh, we get `shell built-in command` -
we'll go over shell builtins and how they work later, but essentially,
they're commands built directly into the shell, instead of an external
program.

</Sidenote>

How are these results displayed on the screen? This is where an important
distinction is required - a shell is **not** the same as a terminal. This
used to trip me up a lot, but it's quite easy once you know it.

The terminal:

- Is the window you have open
- Takes care of rendering characters in the right fonts, colours, emphasis
- Interprets fancy escape codes (depending on which terminal you use)
- Handles scrolling, copy-paste, essentially everything you *see*

The shell:

- Runs as a child process of the terminal
- Is the program that displays a little prompt, takes inputs and responds to
your commands
- Is the brains of the operation

The actual precise interactions are super interesting, but unfortunately not
something we're going to go into much.

<Sidenote>

TODO: add some links here

</Sidenote>

This is actually really neat for us! Because we're building the shell bit, we
don't need to worry at all about graphics programming and displaying stuff on
the screen - all we need is a trusty terminal to do it for us.

I recommend getting a good one that you can feel comfortable in. I quite like
using gnome-terminal, but I've also used konsole, terminator and termite in
the past. Get a good font, customize your colors, and disable that annoying
bell sound.

## How shells works

Now we've seen what shells actually do, we should look at the internals of
what we're aiming for. Modern shells do a little bit of everything. They're
not just responsible for starting new programs up, but they manage existing
ones and provide all sorts of complex builtin functionality.

You can think of the shell as just a big loop: going round and round, over
and over again. Each time, it reads some input, parses it into some internal
format before performing some action, like setting a variable or executing an
external program. Then we start again.

To execute programs, we get to the core of the shell model - just two simple
syscalls to the operating system kernel: `fork` and `execve`:

```c
pid_t fork(void);

int execve(const char *pathname, char *const argv[], char *const envp[]);
```

`fork` is very simple - it makes a copy of the program. One of the programs
is called the parent, and the other is the child - then each program can go
and do it's own different thing. It's very neat, very clever, but it only
produces duplicates - which isn't very useful to start a *different* external
program.

That's what `execve` is for (sometimes just called "exec"). The more acute
readers might see that the arguments to it look *very* similar to what a C
main function looks like - that's not a coincidence. `execve` turns an
existing process __into__ another process, by loading and executing another
program.

So to start a new program it's very simple - we "fork", then the child
process "exec"s, and then the parent can wait on the child to finish.

<Sidenote>

This is actually how *every* process on the system is started. Every process
is forked from another, and `execve`d to make it into a different one.
Every single one.

So where does the first process come from? That's a special process, called
the "init" process, with Process ID 0, which starts everything else as it
runs.

</Sidenote>

```
IMAGE HERE
```

That's it. That's how a shell works. All we need to do is translate from the
input that the user gives us into those two system calls.

<Sidenote>

Yes, this is an oversimplification. There are in fact a few more system calls
involved. However, these are the main ones, and the only ones it's important
to *really* understand for right now.

</Sidenote>

When we get to actually executing programs in the next chapter, you'll notice
we won't actually call these syscalls directly - we'll use a few helper
functions from the Go standard library. But they're still being called under
the hood, as part of our read-parse-execute loop.

## First few lines

All good programs start in a main file: we'll use `main.go`.

```go
// main.go

package main

import (
	"os"

	"github.com/jedevc/go-shell/shell"
)


func main() {
	code := shell.Exec(os.Stdin)
	os.Exit(code)
}
```

This doesn't really do that much at all. All it does is hands off control to
the `Exec` procedure and exits with the code returned by it.

Exit codes deserve a bit of an explanation. We usually think of the "output"
of a command being what is printed out on the screen after running it. For
example:

```bash
$ echo hello
hello
```

But this output isn't really like the return value of a function in any other
language, it's more like a print statement. For something like that, we turn
to *exit codes*. An exit code is just an integer, from **X** to **Y** that
represents why a process terminated. A code of 0 means, all good, everything
is fine, while anything else means something went wrong.

Because we're implementing a shell, we're going to need to keep track of what
exit codes are produced and handle them properly, so it makes sense to start
right now.

All right, so for the actual meat of the code for this chapter:

```go
// shell/shell.go

package shell

import (
	"bufio"
	"fmt"
	"io"
	"log"
)

func Exec(source io.Reader) int {
	// Buffer our reader (so we can read our chunks of text).
	reader := bufio.NewReader(source)

	for {
		// Get a single line of input.
		fmt.Print("> ")
		line, err := reader.ReadString('\n')
		if len(line) > 0 {
			fmt.Print(line)
		}

		// We got a read error!
		if err != nil {
			if err != io.EOF {
				log.Printf("read error: %s", err)
				return 1
			}

			// End of the input stream, not really an issue, just stop
			// processing input!
			break
		}
	}

	return 0
}
```

We pass the function an `io.Reader`, so it can read from *any* source. For
now, we're just reading from our standard input (which defaults to the
terminal input), but next chapter we'll start reading from a variety of
different sources.

Then we print a prompt character, to indicate that the user should input
something, then read a line. After reading it, we print it right back out.
And so on and so on, until we reach the end of the file (press CTRL+D) or get
any other type of error.

<Sidenote>

For our prompt character, we'll use the right angle bracket '>'. This is a
less standard character, but it'll help differentiate between the usual '$'
that's used in most other shells.

From now on, whenever we use '$', it'll mean a standard sh-like shell, and
whenever we use '>' it'll be our custom shell.

</Sidenote>

Now that we've got our code setup, we can run our code. So from your
favourite shell, built and run our project:

```bash
$ go build
$ ./go-shell
> hello shell
hello shell
```

And that's it for this zeroth chapter! We have a very very simple shell that
just echoes out inputs right back at us. Yes, it's simple, but make sure
you've got all of this working before going any further.

Next, we'll actually start executing some commands.
