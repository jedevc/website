---
title: "Generating identicons"
date: 2018-11-02
summary: >
  Ever wondered how to generate github-style identicons? Learn the algorithm
  so you can code your own!
---

For some time, I've been fascinated with github identicons.

I think it's quite easy to see why; they're visually appealing, colourful,
unique, etc.

![github identicons](identicons.png)

Despite the fact that they're simplistic, they're quite distinctive and
pretty.

For example, a while back, I worked on a chat bot project with an online
friend. Despite it having been 2 years since that, I can still remember their
identicon as being purple and looking a bit like the head of an animal.

It's honestly quite surprising that I can remember a seemingly obscure icon
from that long ago and not remember what time I woke up this morning or what
I ate for breakfast.

I'm not an artist, but I imagine that identicons are good at their job
because of the creation of complex shapes, which as humans, we are very good
at automatically recognising and ascribing meaning to. It's kind of like a
practical Rorschach test I suppose. With the addition of colours, a single
icon can become clearly recognizable.

# The algorithm

So how are these icons actually generated? It turns out to be quite easy to
do.

1. Create an empty 5x5 grid.
2. Pick a random colour.
3. Split the grid horizontally down the center, including the middle line to
   get a 3x5 grid.
4. Iterate over the 3x5 grid and optionally fill a square, mirroring it onto
   the other side.
5. Output all the squares in some neat format.

As you can note, this algorithm only requires some output, loops, conditionals,
some string formatting and a little sprinkling of random number generation.

This makes it quite an interesting little project to implement when learning a
new language. If you start out with knowing nothing about a language, by the
end you'll know how to write most of the basic programs that you'll need.

# Building it

So, if you're looking for a neat project to start learning a new language, I
would highly recommend trying to make some identicons. And, they're quite fun
to show off to other people as well!

Here are my personal recommendations for doing it:

- Create the identicons using [svg][svg tutorial]. This is really easy to do
  because you just need to write it to stdout and then redirect it to a file.
  No need to mess around with PNG libraries or HTML5 canvas.
- Allow passing a seed over stdin or through argv.
- Make it flexible - don't just hardcode in magic numbers, instead use
  constants, or, even better let the user modify them.
- Don't just rush through building it, spend time researching the language's
  best practices.

# Conclusion

Hopefully I've convinced you a bit about the glory of identicons. If so,
you might be interested in my various collection of implementations in
different languages on [github](https://github.com/jedevc/Identicon).

If you're interested in reading more about identicons and the different types
that exist, you can read more about it [here][identicons].

[svg tutorial]: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial
[identicons]: https://en.wikipedia.org/wiki/Identicon
