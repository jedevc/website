---
title: "Building a symbolic executor for AoC day 24"
date: 2022-01-17
summary: >
  Can we solve AoC day 24 without looking at the input at all? (spoiler, yes
  and it's quite neat)
---

Advent of Code is one of my favorite coding events all year - for the
uninitiated, it's a series of 25 coding puzzles that take place during the
month of December as part of the lead-up to Christmas day. This year was quite
fun, though one puzzle definitely captured my attention more than any of the
others - day 24.

For the full puzzle description, see [here](https://adventofcode.com/2021/day/24),
but I'll summarize:

> The ALU is a four-dimensional processing unit: it has integer variables w, x,
> y, and z. These variables all start with the value 0. The ALU also supports
> six instructions.
>
> - `inp a`
> - `add a b`
> - `mul a b`
> - `div a b`
> - `mod a b`
> - `eql a b`

> The ALU will run the MOdel Number Automatic Detector program (MONAD, your
> puzzle input).

> After MONAD has finished running all of its instructions, it will indicate
> that the model number was valid by leaving a 0 in variable z. However, if the
> model number was invalid, it will leave some other non-zero value in z.

> To enable as many submarine features as possible, find the largest valid
> fourteen-digit model number that contains no 0 digits. What is the largest
> model number accepted by MONAD?

The [Reddit solutions thread](https://www.reddit.com/r/adventofcode/comments/rnejv5/2021_day_24_solutions/)
for this day is really wonderful - there's a combination of brute force
implementations, reverse engineering the MONAD program itself (which is what I
initially did), and some other weird and out there solutions. However, my
favorite solutions are the ones that both 1. run in a reasonable amount of
time, and 2. don't assume _anything_ about the structure of the input program.

So, in this post, I've attempted to explain my solution which achieves both of
these goals by using the magic of ✨ symbolic execution ✨.

## Symbolic execution?

Put simply, [symbolic execution](https://en.wikipedia.org/wiki/Symbolic_execution)
is another way of executing a program - however, instead of storing actual
values like `1` or `42` or `2^10`, we store variables like `a` or `b`. Then we
run the program for these symbolic values, which lets us generate a system of
constraints - which we can then solve. For example:

```python
x = int(input())
if x < 3:
    print("success")
else:
    print("failure")
```

In the above, we read `x` as an integer input from a user, and if it's less
than `3`, we print `"success"`, otherwise we print `"failure"`. In the world of
symbolic execution, at first, the value of `x` is unconstrained and could be
any integer. However, in each branch of the `if`-statement, `x` is constrained
differently; in the success branch, `x < 3`, in the failure branch `x >= 3`.
These are the constraints we could then solve, to find a value of `x` for each
scenario.

Symbolic execution is a very powerful technique, made slightly more complex to
implement by the fact that real-world languages have a lot of different
expression and statement types and that real-world code often has a lot of
branching.

{{< sidenote >}}

There's a _lot_ of use of symbolic execution in academic security - it's often
given as an alternative (or partner) to
[fuzzing](https://en.wikipedia.org/wiki/Fuzzing), and has the potential to find
very niche and specific issues that many other automated methods struggle to.

It does have a major downside though, which explain why it's not more widely
used outside: the state space explosion problem. Essentially, modern complex
programs (the ones you often want to have automatic checks on) branch way too
much, so tracking (and solving) every single constraint rapidly becomes
impossible. And while there are sophisticated techniques for working around
this, they do so at the loss of some accuracy.

{{< /sidenote >}}

Thankfully, for day 24, we don't either of those! We have just 6 instructions,
and none of those are branching, so we should be able to implement something
fairly easily!

## The code

Let's start writing some code - I've picked Rust, mostly because I'm
comfortable with it, and because I solved all the other days in it as well, but
also because I think it lends itself to a very neat implementation of this
problem that should be easy to follow along with even if you're not familiar
with it.

The final finished product can be found [here](https://github.com/jedevc/symbolic-executor-aoc/blob/trunk/src/main.rs),
along with the related cargo files and my puzzle input.

First off, let's get our imports out of the way - we'll end up using these
throughout the rest of the program.

```rust
use std::collections::HashMap;
use std::fs;
```

We can then start by getting the input into a nice, easy-to-use structure so we
can manipulate it later on.

### Parsing

We're going to organize our program into a number of distinct sections. In this
first section, we'll turn the textual representation of the program into code
representations like `struct`s and `enum`s which will let us manipulate them
more easily (and also lead to cleaner code).

First off, we have our program object which is just a series of instructions:

```rust
struct Program {
    instructions: Vec<Instruction>,
}
```

Following from that, we have our 6 instructions. Aside from `Inp`, the rest of
the instructions operate on a register and a value, somehow combining them, and
then writing the result back to the register.

```rust
enum Instruction {
    Inp(Register),
    Add(Register, Value),
    Mul(Register, Value),
    Div(Register, Value),
    Mod(Register, Value),
    Eql(Register, Value),
}
```

We then have our 4 different registers, `w`, `x`, `y` and `z`. We'll `derive` a
couple of different traits that we'll use later, but they're mostly just giving
us a few shortcuts we'll be able to use.

```rust
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
enum Register {
    W,
    X,
    Y,
    Z,
}
```

Finally, we have our values, which can either be loaded from a register, or a
literal value encoded into the program:

```rust
#[derive(Clone, Copy)]
enum Value {
    Load(Register),
    Literal(i64),
}
```

Now that we have our main data structures defined, we can parse our program
into these. We'll start with the easiest case, parsing a single register.

```rust
impl Register {
    fn parse(data: &str) -> Result<Self, String> {
        match data {
            "w" => Ok(Register::W),
            "x" => Ok(Register::X),
            "y" => Ok(Register::Y),
            "z" => Ok(Register::Z),
            _ => Err(format!("invalid register")),
        }
    }
}
```

Relatively straightforward, so we can move on to the slightly more complex
values, which can either be a register or an integer:

```rust
impl Value {
    fn parse(data: &str) -> Result<Self, String> {
        if let Ok(reg) = Register::parse(data) {
            Ok(Value::Load(reg))
        } else if let Ok(n) = data.parse::<i64>() {
            Ok(Value::Literal(n))
        } else {
            Err(format!("invalid value"))
        }
    }

    fn as_register(&self) -> Result<Register, String> {
        if let Value::Load(reg) = self {
            Ok(*reg)
        } else {
            Err(format!("value is not a register"))
        }
    }
}
```

While we're here, we also define an `as_register` function, which extracts the
register from a value if it has one: this'll make parsing instructions just a
little neater.

Speaking of which, we can now parse whole instructions. Let's start by taking
our instruction of the form `<inst> <arg> <arg>?` and extracting the
instruction and all the arguments.

```rust
impl Instruction {
    fn parse(data: &str) -> Result<Self, String> {
        let parts: Vec<&str> = data.split(" ").collect();
        if parts.len() == 0 {
            return Err(format!("empty line"));
        }

        let instruction = parts[0];
        let operands: Result<Vec<_>, _> = parts[1..]
            .iter()
            .map(|s| Value::parse(s))
            .collect();
        let operands = operands?;
```

{{< sidenote >}}

I love this little trick - `collect`ing into a `Result<T>` instead of directly
into a `T`.

This works really nicely if you're got an `Iterator` of `Result`s, and need to
somehow get a single `Vec` out of it - instead of throwing the error away or
`unwrap`ing it, the first error is collected into the `Result`.

{{< /sidenote >}}

To cleanup the implementation for the next bit, we can write a couple of
macros that parse both instructions that take a single and double arguments
respectively:

```rust
        macro_rules! unary {
            ($inst: expr) => {{
                if operands.len() != 1 {
                    return Err(format!("invalid argument count"));
                }
                $inst(operands[0].as_register()?)
            }};
        }
        macro_rules! binary {
            ($inst: expr) => {{
                if operands.len() != 2 {
                    return Err(format!("invalid argument count"));
                }
                $inst(operands[0].as_register()?, operands[1])
            }};
        }
```

{{< sidenote >}}

This is kinda a weird use of macros - probably not the best idea for production
code, but it was a lot shorter than some of the other alternatives that I tried
for, and for a blog post, short code blocks matter.

Having come from a world of C/C++, it's quite pleasant to realize that macros
are scoped, so they won't escape this function.

{{< /sidenote >}}

Then our final step of parsing instructions just falls out of the above:

```rust
        match instruction {
            "inp" => Ok(unary!(Instruction::Inp)),
            "add" => Ok(binary!(Instruction::Add)),
            "mul" => Ok(binary!(Instruction::Mul)),
            "div" => Ok(binary!(Instruction::Div)),
            "mod" => Ok(binary!(Instruction::Mod)),
            "eql" => Ok(binary!(Instruction::Eql)),
            _ => Err(format!("unknown instruction")),
        }
    }
}
```

To complete our parsing, we add a `parse` method for our program:

```rust
impl Program {
    fn parse(data: &str) -> Result<Program, String> {
        let instructions: Result<Vec<_>, _> = data
            .lines()
            .map(Instruction::parse)
            .collect();
        let instructions = instructions?;
        Ok(Self { instructions })
    }
}
```

That concludes our parsing stage, now let's move on to execution!

### Execution

In this stage we'll create a `SymbolicExecutor` struct which can symbolically
run through a program. However, because we want to keep our code flexible,
let's implement a trait (like an interface, if you're not familiar with Rust)
for a general `Executor`:

```rust
trait Executor {
    fn exec(&mut self, instruction: &Instruction) -> Result<(), String>;
}
```

An `Executor` takes a single instruction and modifies it's internal state with
the result of that instruction, possibly returning an error if something goes
wrong.

We want to run `Executor`s over a whole program though, so let's write a helper
function for that:

```rust
fn run<E: Executor>(program: &Program, executor: &mut E) -> Result<(), String> {
    for instruction in &program.instructions {
        executor.exec(instruction)?;
    }
    Ok(())
}
```

{{< sidenote >}}

Originally, I also wanted to include a `ConcreteExecutor` in this post, which
would just simply execute the code normally - however, that ended up being too
long and unnecessary. If you're interested though, it's in the finished
version of the code I linked above.

{{< /sidenote >}}

With our trait out of the way, let's actually define our symbolic executor:

```rust
struct SymbolicExecutor {
    w_idx: usize,
    x_idx: usize,
    y_idx: usize,
    z_idx: usize,
    input_idx: usize,
    registers: HashMap<SymbolicRegister, Expression>,
}
```

These fields need some explanation. What we essentially want to do with our
symbolic executor is transform our program into a collection of variable
assignments. However, we don't want to use a single variable more than once.

{{< sidenote >}}

This kind of representation of only using a variable once is called
[Single Static Assignment](https://en.wikipedia.org/wiki/Static_single_assignment_form)
and is used in almost all optimizing compilers to efficiently determine data
flow. Essentially it allows to encode time in the variables in themselves, not
relying on execution proceeding from top-to-bottom - which makes it useful
here, since our constraints won't be organized by time either.

{{< /sidenote >}}

So for example, the program

```
inp x
add x 1
```

Should be turned into something like, where `iX` is the value at the `X`th
index into the input string:

```
x0 = i0
x1 = x0 + 1
```

So, going back to our `SymbolicExecutor`, the `_idx` variables represent the
most recent write to a register. We'll use these values to construct
`SymbolicRegister`s, which we'll assign to `Expression`s. This should make more
sense once we start implementing the `exec` method on this.

However, we now need to actually define `Expression`s and `SymbolicRegister`s:

```rust
enum Expression {
    Unit(SymbolicValue),
    Add(SymbolicValue, SymbolicValue),
    Mul(SymbolicValue, SymbolicValue),
    Div(SymbolicValue, SymbolicValue),
    Mod(SymbolicValue, SymbolicValue),
    Eql(SymbolicValue, SymbolicValue),
}

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
struct SymbolicRegister {
    reg: Register,
    idx: usize,
}

enum SymbolicValue {
    Load(SymbolicRegister),
    Literal(i64),
    Input(usize),
}
```

These are essentially almost identical to the normal `Value`s and `Register`s,
however, in these structures we have two new things:

1. The ability to represent inputs as values.
2. The ability to contain an index variable for each register and the input,
   which lets us represent program flow over time in a series of mathematical
   assignments.

Our `Expression`s bind these concepts together, to produce the right hand side
of our assignments.

{{< sidenote >}}

So, why even parse into normal `Value`s and `Register`s in the first place if
we're just going to get rid of them?

I wanted to split up the idea of the "concrete" representation of a program
(what's actually executed and run) from the "symbolic" representation (which is
much more mathematical and expresses relationships). Also, it kinda made sense
if I wanted to have a `ConcreteExecutor`.

{{< /sidenote >}}

So, let's build our executor's implementations. To start, let's create a
default constructor:

```rust
impl SymbolicExecutor {
    fn new() -> Self {
        let mut registers = HashMap::new();
        for reg in [Register::W, Register::X, Register::Y, Register::Z] {
            // the default values of each register are 0
            registers.insert(
                SymbolicRegister { reg: reg, idx: 0 },
                Expression::Unit(SymbolicValue::Literal(0)),
            );
        }

        Self {
            w_idx: 0,
            x_idx: 0,
            y_idx: 0,
            z_idx: 0,
            input_idx: 0,
            registers,
        }
    }
}
```

We initialize all of our indexes to zero (to represent the beginning of time),
and also add default values for each register, creating the assignments
`w0 = 0`, `x0 = 0`, `y0 = 0` and `z0 = 0`.

Now we can implement our `exec` function! We're going to use a couple of helper
functions which we haven't yet implemented, but we'll get to those in a moment.

First we create a simple macro which constructs an expression from a program
register and values:

```rust
impl Executor for SymbolicExecutor {
    fn exec(&mut self, instruction: &Instruction) -> Result<(), String> {
        macro_rules! apply {
            ($lhs:expr, $op:expr, $rhs:expr) => {
                self.write_reg(
                    $lhs,
                    $op(
                        SymbolicValue::Load(self.read_reg($lhs)),
                        self.read_val($rhs),
                    ),
                )
            };
        }
```

Then we just write execution implementations for each of our instructions:

```rust
        match instruction {
            Instruction::Inp(reg) => {
                let input = SymbolicValue::Input(self.input_idx);
                self.input_idx += 1;
                self.write_reg(*reg, Expression::Unit(input));
            }
            Instruction::Add(reg, val) => apply!(*reg, Expression::Add, *val),
            Instruction::Mul(reg, val) => apply!(*reg, Expression::Mul, *val),
            Instruction::Div(reg, val) => apply!(*reg, Expression::Div, *val),
            Instruction::Mod(reg, val) => apply!(*reg, Expression::Mod, *val),
            Instruction::Eql(reg, val) => apply!(*reg, Expression::Eql, *val),
        }

        Ok(())
    }
}
```

The special case here is of course, the `inp` instruction, essentially first
transforming `inp w` into for the first input `wX = i0`, `wX = i1` for the
second input, etc, etc.

Let's dive into our helper functions. `read_reg` takes a program register and
turns it into a symbolic register, based on how many times we've written to
that register before.

```rust
impl SymbolicExecutor {
    fn read_reg(&self, reg: Register) -> SymbolicRegister {
        let idx = match reg {
            Register::W => self.w_idx,
            Register::X => self.x_idx,
            Register::Y => self.y_idx,
            Register::Z => self.z_idx,
        };
        SymbolicRegister { reg, idx }
    }
```

Then `read_val` is a simple helper that take a program value and turns it into
a symbolic value - as you can imagine, it's quite a simple implementation:

```rust
    fn read_val(&self, val: Value) -> SymbolicValue {
        match val {
            Value::Load(reg) => SymbolicValue::Load(self.read_reg(reg)),
            Value::Literal(n) => SymbolicValue::Literal(n),
        }
    }
```

Finally, `write_reg` writes backs to a register, incrementing the index every
time we write:

```rust
    fn write_reg(&mut self, reg: Register, value: Expression) {
        let idx = match reg {
            Register::W => {
                self.w_idx += 1;
                self.w_idx
            }
            Register::X => {
                self.x_idx += 1;
                self.x_idx
            }
            Register::Y => {
                self.y_idx += 1;
                self.y_idx
            }
            Register::Z => {
                self.z_idx += 1;
                self.z_idx
            }
        };
        self.registers.insert(SymbolicRegister { reg, idx }, value);
    }
```

...and believe it or not, that's pretty much everything we need to symbolically
execute the program! Let's continue to work out how we can take these
assignments and generate constraints to solve.

### Constraint solving

Constraint solving is quite fiddly - thankfully, we don't need to do it
ourselves, we can use a piece of software called an SMT solver. One of
the most well-known solvers is called `z3`, and is developed by Microsoft
research. `z3` can accept a lot of different inputs, but we're going to feed it
SMTLIB2 code, which is essentially a collection of s-expressions which
represent constraints - once we've done this, we say "solve!", and it'll work
backwards from our constraints to find valid inputs!

{{< sidenote >}}

Ahhh, the memories - tools like z3 are so much fun in Capture the Flag
competitions, especially complex reverse engineering ones. You can just a
framework like [Angr](http://angr.io/) to make a linux program's inputs
symbolic, and then print out the inputs that allow you to get to a certain
state, like the one that prints out the flag.

{{< /sidenote >}}

The way we'll generate these s-expressions is by simply `print`ing them out,
which we can then redirect to a fil and run z3 over.

In that spirit, let's write a main function!

```rust
fn main() -> Result<(), String> {
    let program = fs::read_to_string("program.txt").unwrap();
    let program = program.trim();
    let program = Program::parse(program)?;

    search(program)
}
```

We'll read the program from a file, and then parse it into out program object -
then we'll produce a z3 program to search for a satisfying input.

To start, we'll invoke our wonderful `SymbolicExecutor`:

```rust
fn search(program: Program) -> Result<(), String> {
    let mut exec = SymbolicExecutor::new();
    run(&program, &mut exec)?;
```

Then, we'll create our declarations for every variable (registers and inputs)
we're going to use in our program. Remember, we do this by outputting
s-expressions:

```rust
    for idx in 0..exec.input_idx {
        let var = SymbolicValue::Input(idx);
        println!("(declare-fun {} () (_ BitVec 64))", var.smt());
    }
    for (reg, _) in &exec.registers {
        println!("(declare-fun {} () (_ BitVec 64))", reg.smt());
    }
```

{{< sidenote >}}

So, while you _could_ use `Int`s instead of bit-vectors here, doing so will
give you some major performance problems - I know, because this is initially
what I did. This performance issues comes from the fact that using bit-vectors
uses a different smt logic which is more optimized for our particular problem.

{{< /sidenote >}}

We define each input value and each state of each register to be a function
with no inputs (that's just how we do it), that returns a 64-bit bit-vector -
we'll treat these as signed integers. You'll see the `.smt()` function being
called - we'll define the details of that in a moment.

We can then codify our assertion! Let's start with a simple constraint, i.e.
all input values need to be between 1 and 9 (inclusive).

```rust
    for idx in 0..exec.input_idx {
        let var = SymbolicValue::Input(idx);
        println!(
            "(assert (bvsge {} {}))",
            var.smt(),
            SymbolicValue::Literal(1).smt()
        );
        println!(
            "(assert (bvsle {} {}))",
            var.smt(),
            SymbolicValue::Literal(9).smt()
        );
    }
```

The loop iterates over every possible input index, creates a symbolic value for
it, just like we did during our execution step. The weird `bvsge` and `bvsle`
functions are bit vector greater-than-or-equal-to and bit vector
less-than-or-equal-to respectively.

Next, we know that the final value of the `z` register should be equal to zero
(so that we get MONAD to execute correctly):

```rust
    println!(
        "(assert (= {} {}))",
        exec.read_reg(Register::Z).smt(),
        SymbolicValue::Literal(0).smt()
    );
```

Finally, we just need to encode our constraints from symbolic execution! This
is actually surprisingly uninvolved:

```rust
    for (reg, expr) in &exec.registers {
        println!("(assert (= {} {}))", reg.smt(), expr.smt());
    }
```

We just need to print the closing parts of our z3 program now:

```rust
    println!("(check-sat)");
    println!(
        "(get-value ({}))",
        (0..exec.input_idx)
            .map(|idx| SymbolicValue::Input(idx).smt())
            .collect::<Vec<_>>()
            .join(" ")
    );

    Ok(())
```

The `check-sat` function prints either `sat` or `unsat` depending on whether
the constraints actually allow a valid assignment of variables. Then, the
`get-value` function prints out what the solver has determined our input values
must be!

The only remaining part of the program is to now define how all our symbolic
values actually turn in SMTLIB2 expressions by implementing the `.smt()`
function. Let's start with a trait (since we'll be implementing it multiple
times):

```rust
trait SMT {
    fn smt(&self) -> String;
}
```

Let's start with `SymbolicRegister`s:

```rust
impl SMT for SymbolicRegister {
    fn smt(&self) -> String {
        let reg = match self.reg {
            Register::W => "w",
            Register::X => "x",
            Register::Y => "y",
            Register::Z => "z",
        };
        format!("{}{}", reg, self.idx)
    }
}
```

So the first value of `z` will be represented by the string `"z0"`, the second
value by `"z1"`, etc.

`SymbolicValue`s are a little more involved, but not by much:

```rust
impl SMT for SymbolicValue {
    fn smt(&self) -> String {
        match self {
            SymbolicValue::Load(reg) => reg.smt(),
            SymbolicValue::Input(idx) => format!("i{}", idx),
            SymbolicValue::Literal(n) => {
                let literal = format!("(_ bv{} 64)", n.abs());
                let literal = if *n < 0 {
                    format!("(bvneg {})", literal)
                } else {
                    literal
                };
                literal
            }
        }
    }
}
```

For `Load`s, we can delegate to the `SymbolicRegister` implementation, for
`Input`s we create a variable called `iX` where `X` is the index, while for the
`Literal` we construct a literal. The literal construction essentially
constructs a bit vector literal, optionally, using the `bvneg` function to
construct negative values, since bit vector literals can't have negative
numbers attached using the construction we've used.

Finally, just the `Expression` left, essentially transforming each expression
type into a calculation:

```rust
impl SMT for Expression {
    fn smt(&self) -> String {
        match self {
            Expression::Unit(unit) => unit.smt(),
            Expression::Add(left, right) => format!("(bvadd {} {})", left.smt(), right.smt()),
            Expression::Mul(left, right) => format!("(bvmul {} {})", left.smt(), right.smt()),
            Expression::Div(left, right) => format!("(bvsdiv {} {})", left.smt(), right.smt()),
            Expression::Mod(left, right) => format!("(bvsmod {} {})", left.smt(), right.smt()),
            Expression::Eql(left, right) => format!(
                "(ite (= {} {}) {} {})",
                left.smt(),
                right.smt(),
                SymbolicValue::Literal(1).smt(),
                SymbolicValue::Literal(0).smt()
            ),
        }
    }
}
```

The only slightly confusing one is the implementation of `eql`: for this
function, we use the if-then-else (`ite`) function to evaluate the conditional,
then return `1` if true and `0` if false.

...and that brings us to completion! That's all the code we need to implement a
basic symbolic execution engine!

### Running the code

Taking all the code and putting into a cargo project means we can easily build
and run it:

```bash
$ cargo build
$ cargo run > monad.smt
```

We can skim the contents of `monad.smt` just to make sure we've got everything
correct:

```
(declare-fun i0 () (_ BitVec 64))
(declare-fun i1 () (_ BitVec 64))
(declare-fun i2 () (_ BitVec 64))
...
(assert (bvsge i0 (_ bv1 64)))
(assert (bvsle i0 (_ bv9 64)))
...
(assert (= z42 (_ bv0 64)))
...
(assert (= y7 (bvadd y6 (_ bv4 64))))
(assert (= y109 (bvmul y108 (_ bv0 64))))
(assert (= y22 (bvadd y21 w3)))
...
(check-sat)
(get-value (i0 i1 i2 i3 i4 i5 i6 i7 i8 i9 i10 i11 i12 i13))
```

Once we're satisfied with the results, we can solve!

```bash
$ z3 monad.smt
sat
((i0 #x0000000000000009)
 (i1 #x0000000000000001)
 (i2 #x0000000000000009)
 (i3 #x0000000000000002)
 (i4 #x0000000000000008)
 (i5 #x0000000000000009)
 (i6 #x0000000000000001)
 (i7 #x0000000000000004)
 (i8 #x0000000000000009)
 (i9 #x0000000000000009)
 (i10 #x0000000000000009)
 (i11 #x0000000000000009)
 (i12 #x0000000000000008)
 (i13 #x0000000000000001))
```

The resulting output makes up our digits: `91928914999981`!

However, this isn't _quite_ the solution to the AOC problem: remember, we want
to find the **largest** possible id number, not just any id number.

So back to our code, we can add an optimization to our set of constraints right
before our `(check-sat)`:

```rust
    println!(
        "(maximize (bvadd {}))",
        (0..exec.input_idx)
            .map(|idx| {
                let var = SymbolicValue::Input(idx);
                let factor = 10_i64.pow((exec.input_idx - idx) as u32);
                Expression::Mul(var, SymbolicValue::Literal(factor)).smt()
            })
            .collect::<Vec<_>>()
            .join(" ")
    );
```

To understand this, let's look at the output:

```
(maximize (bvadd (bvmul i0 (_ bv100000000000000 64)) (bvmul i1 (_ bv10000000000000 64)) ... (bvmul i13 (_ bv10 64))))
```

Essentially, this will tell z3 to produce the result which maximizes the sum of
all the digits multiplied by their place-significance. This means that
increasing the value of `i0` becomes more important than increasing the value
of `i1`, and so on.

Running the constraint solver again:

```bash
$ cargo run > monad.smt
$ z3 monad.smt
((i0 #x0000000000000009)
 (i1 #x0000000000000002)
 (i2 #x0000000000000009)
 (i3 #x0000000000000002)
 (i4 #x0000000000000008)
 (i5 #x0000000000000009)
 (i6 #x0000000000000001)
 (i7 #x0000000000000004)
 (i8 #x0000000000000009)
 (i9 #x0000000000000009)
 (i10 #x0000000000000009)
 (i11 #x0000000000000009)
 (i12 #x0000000000000009)
 (i13 #x0000000000000001))
```

We get `92928914999991`, which is the correct answer for my input!

{{< sidenote >}}

And then of course, you can use the `minimize` function instead of the
`maximize` function to get the smallest input to solve part 2.

{{< /sidenote >}}

### Conclusion

From scratch, we've build a symbolic executor for the assembly language defined
in Advent of Code day 24! You can find the whole codebase, with a few extra
additions, [here](https://github.com/jedevc/symbolic-executor-aoc/blob/trunk/src/main.rs).

If anything's still not particularly clear, please, get in contact, I'd love to
clarify!

Thanks for reading, and hopefully see you again soon!
