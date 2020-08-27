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

On your wonderful Unix-y Operating System, we then need to [install
go][go-installer]. I won't include instructions here, the official go website
has pretty good ones already which you can use if you don't have it already.

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

There are *many* places that programs might be installed in your system.

Where those places are, and how they're connected depends entirely on your
distribution. On Linux, we tend to follow the [Filesystem Hierarchy Standard][fhs]
which lists the differences between /bin, /sbin, /usr/bin, /usr/sbin,
/usr/local/bin, etc. A few distributions (like Arch) change it up by linking
those together so they have the same contents and there is no difference.

At the end of the day, it doesn't matter where your programs might be, as
long as the `PATH` environment variable points to the parent directory - then
it can be found by all your tools.

</Sidenote>

This simple command illustrates the flexibility of a shell over something
like a point-and-click interface. We use `ls` to list some files, then *pipe*
it into `wc` to count the number of files. We don't need a new command to
count the number of files in a directory, we just compose existing commands
together to do new things.

There are many different implementations of shells out there - sh, bash, zsh,
dash, etc. You interact with all of them by typing in commands, which then
execute different programs around your system.

You can see where different programs live with the `which` program:

	$ which ls
	/usr/bin/ls
	$ which wc
	/usr/bin/wc

<Sidenote>

How about `which which`? Hehe.

The result you get depends on the shell that you're using. For example, on
bash, we get `/usr/bin/which` - what we'd expect. On zsh, we get `shell
built-in command` - we'll go over shell builtins and how they work later, but
essentially, they're commands built directly into the shell, instead of an
external program.

</Sidenote>

So how do programs actually read input and print outputs to the screen? This
is where the magic idea of ["Everything is a
file"][wikipedia-everything-is-a-file] comes into play. If everything is a
file, then all we need to do anything are just really good file processing
utilities. This idea is extended even to printing output to the screen and
reading input from the keyboard.

It might seem overcomplicated and weird, but it's neat when you get used to
it. It means that the same functions and procedures you use to
[read][wikipedia-read] and [write][wikipedia-write] files are also the same
ones used to [print to the screen][linux-stdout], or [send network
packets][linux-socket], or even work out what [programs are
running][wikipedia-procfs] on a system.

A normal process will have at least 3 files when it opens: stdin, stdout and
stderr. Stdin reads input, stdout prints output, and stderr... also prints
output.

Why bother having two outputs? Well, stdout prints "normal" output, while
stderr prints "error" output - that means we can separate them out, and treat
the errors differently to the normal output if we want.

### Shells vs Terminals

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
- Is the program that displays a prompt, takes inputs and responds to your
commands
- Is the brains of the operation

The actual precise interactions are super interesting, but unfortunately not
something we're going to go into much.

<Sidenote>

The word "terminal" is actually kind of wrong. We mean ["terminal
emulator"][wikipedia-terminal-emulator] - all consoles are actually
pretending to be physical terminals like the [VT100][wikipedia-vt100]. But we
shorten it to just be "terminal", because we don't really use physical
terminals anywhere anymore - but the name has kinda stuck.

The GNOME project has a pretty decent overview [here][gnome-terminal].

</Sidenote>

This is actually really neat for us! Because we're building the shell bit, we
don't need to worry at all about graphics programming and displaying stuff on
the screen - all we need is a trusty terminal to do it for us.

I recommend getting a good one that you can feel comfortable in. I quite like
using gnome-terminal, but I've also used konsole, terminator and termite in
the past. Get a good font, customize your colors, and disable that annoying
bell sound.

## How shells work

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
of a command being what is printed out on the screen (by writing to stdout).
For example:

```bash
$ echo hello
hello
```

But this output isn't really like the return value of a function in any other
language, it's more like a print statement. For something like that, we turn
to *exit codes*. An exit code is just an integer, from 0 to 255 that
represents why a process terminated. A code of 0 means, all good, everything
is fine, while anything else means something went wrong.

<Sidenote>

There is a *surprising* lack of standards for different exit codes. Those
standards *do* exist, (see [here][freebsd-sysexits] or
[here][tldp-exitcodes]) but many programs won't follow them.

If you get a code that you don't understand, read the man page and see what
the program-specific documentation says.

</Sidenote>

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

In the next chapter, we can actually start executing some commands from the
system.

<Message>

So, as an appendix to each chapter, I thought it would be interesting to kind
of include some more details for anyone interested in some of the
less-necessary, but still interesting information.

So 🎉

## On POSIX compatibility

POSIX (according to [Wikipedia][wikipedia-posix]) "is a family of standards
specified by the IEEE Computer Society for maintaining compatibility between
operating systems". Essentially, it's a collection of interfaces and
specifications for making sure that different UNIX flavours look and feel the
same.

POSIX has standards for __everything__ (or what seems like it). Everything
from standard C libraries (that aren't part of the main C standard), how
processes should work and interact with each other, how threads should work.
Unsurprisingly, one of the standards covers how a "shell" should behave.

This is the reason why a shell on Linux feels similar to how one on BSD does.
It's actually quite an accomplishment, that all of this stuff is implemented
differently, by different pieces of software all preserve the same kind of
behaviour.

Now, as a shell tutorial, it might be reasonable to expect that we would be
constructing a POSIX-compatible shell! No. So much no.

In the modern world, POSIX-compatibility is often treated as a bit of a
curse. The spec is *vast* and places tight constraints on exactly how things
should work, as well as includes a number of incredibly difficult to
implement features.

Additionally, POSIX has a few... historical artifacts. For example, while we
have variables, it's very difficult to express concepts like arrays and hash
tables, which we often get as a given in modern proramming languages. This
lack of support means that many shells go their own way and implement their
own specific extensions to handle these cases... and even then, they're a bit
of an afterthought, and have some interesting behavioural quirks.

Modern shells may attempt to drop all this historical baggage by creating
something entirely new, like fish, or xonsh, or many many others. They get to
have nice shiny syntax, and do things the way they want, and on the surface
they might *look* like a POSIX shell - but in the edge cases, there will be
differences.

We're going to take a leaf out of these newer shells' books and do our own
thing that looks close enough to POSIX. There's a surprising amount of
subtlety that I just couldn't find a way to implement neatly and clearly in
1000 lines, like how you handle backslashes, or what's the exact order of
operations for file redirections, or how you handle quotes in expansions.

It's slightly annoying and bothers me that we can't be compatible, but after
4 hours of trying to neatly implement backslashes in the parser, expansions,
and everywhere else, I'm not going to be trying for POSIX-compatibility any
time soon :)

</Message>

[freebsd-sysexits]: https://www.freebsd.org/cgi/man.cgi?query=sysexits&sektion=3
[gnome-terminal]: https://help.gnome.org/users/gnome-terminal/stable/overview.html.en
[go-installer]: https://golang.org/doc/install
[linux-socket]: https://linux.die.net/man/7/socket
[linux-stdout]: https://linux.die.net/man/3/stdout
[tldp-exitcodes]: https://tldp.org/LDP/abs/html/exitcodes.html
[wikipedia-everything-is-a-file]: https://en.wikipedia.org/wiki/Everything_is_a_file
[wikipedia-fhs]: https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard
[wikipedia-posix]: https://en.wikipedia.org/wiki/POSIX
[wikipedia-procfs]: https://en.wikipedia.org/wiki/Procfs
[wikipedia-read]: https://en.wikipedia.org/wiki/Read_(system_call)
[wikipedia-terminal-emulator]: https://en.wikipedia.org/wiki/Terminal_emulator
[wikipedia-vt100]: https://en.wikipedia.org/wiki/VT100
[wikipedia-write]: https://en.wikipedia.org/wiki/Write_(system_call)
