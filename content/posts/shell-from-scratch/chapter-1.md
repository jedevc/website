---
title: "Shell from Scratch - Chapter 1"
date: 2020-06-17
description: >
  Shell from Scratch (Chapter 1 - External commands)
hidden: true
---

A shell executes commands - so let's get some command execution working. A
lot of the things we do this chapter might seem a bit over-the-top, but we're
laying the ground work for the things to come.

## Making nodes

How do we know what commands we should execute (what parameters to pass our
`execve` syscall)? We need to store all that information somewhere - and
we'll store it in a `Node`. A `Node` will just be a very simple interface:

```go
// shell/node.go

package shell

type Node interface {
	Exec(ctx ExecContext) int
}
```

It returns an integer status code, and executes "something" based on a context it's provided. At the moment, there's not too much value to this abstraction, but later we'll be able to connect our nodes together in really interesting ways.

This interface references a data type we haven't defined yet, ExecContext, so let's go and provide a basic definition:

```go
// shell/shell.go

...

type ExecContext struct {
    Log *log.Logger
}

...
```

This will just provide us with a way to bundle together multiple utilities together, without then needing to go and modify the `Node` interface and all of it's implementors later.

Now we can define a `SimpleNode`, one that just executes a single command.

```go
// shell/node.go
package shell

import (
    "os"
    "os/exec"
)

...

type SimpleNode struct {
	Words []string
}

func (node *SimpleNode) Exec(ctx ExecContext) int {
    // First word is the name of the program.
    // The rest are the arguments to it.
    cmd := exec.Command(node.Words[0], node.Words[1:]...)
    
    // Assign file descriptors of child to be the same as the parent.
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    
    // Run, and wait for it to finish.
	err := cmd.Run()

	if err != nil {
		if _, ok := err.(*exec.ExitError); !ok {
			// Some internal error occurred.
			ctx.Log.Print(err)
			return 1
		}
	}

    // Return the exit code of the child process.
	return cmd.ProcessState.ExitCode()
}
```

The `SimpleNode` just executes the `Words` it has been given. Why `Words`?
Well, unfortunately, I ran out of creativity, and couldn't think of a better
term. It's also fairly standard to refer to the results of parsing as "words"
so it seemed ok.

## Parsing

Now that we know how we can execute commands, let's work backwards - and
build a simple, hacky parser to populate these `Words`.

```go
// shell/parser.go

package shell

import (
	"bufio"
	"io"
	"strings"
)

type Parser struct {
	reader *bufio.Reader
	eof    bool
	err    error
}
```

Everything is going to be oriented around this `Parser` structure. The parser
contains a simple buffered stream of data, which it will query every time we
ask it for more input. This means we can hook it up directly to `os.Stdin` for the duration of the program!

We also include a simple boolean variable for checking if the parser has reached the end of the stream, and a variable to keep track of errors, so we don't need to fall back to the common go pattern of `if err != nil` then `return err` which quickly fills up our line count!

<Sidenote>

In a traditional high level language, we wouldn't bother with keeping track
of the errors like this! We'd just use exceptions, throw them up the stack,
and let someone else handle it and print a nice error to the screen.

In Go, for better or for worse, we can't do that. But if we have to
constantly return errors from every function in our parser, it's going to get
very messy very quickly. For your implementation, you might want to do this -
feel free.

However, this technique is shorter and more C-idiomatic, as it's similar to
how different functions might set an `errno` value to provide more error
information to other parts of the program.

</Sidenote>

We'll quickly add a couple of helper functions:

```go
// shell/parser.go

...

func (parser *Parser) Init(reader *bufio.Reader) {
	parser.reader = reader
}

func (parser *Parser) Done() bool {
	return parser.eof
}

func (parser *Parser) Error() error {
	err := parser.err
	parser.err = nil
	return err
}
```

These will help us to avoid repeating ourselves over and over again. They're
all pretty obvious - the only one that's slightly interesting is the `Error`
method, we return the error we've found, and then discard it from our
internal storage! We don't care about it anymore - it's their problem now.

...

## Putting it all together

...