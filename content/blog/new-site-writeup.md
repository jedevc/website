---
title: How I built this site
date: 2020-06-04
summary: >
  After two years with a default theme website, I've built my own flashy
  website from scratch using Gatsby, Bulma and Netlify!
---

Woooo!

Finally, the time has come for an upgraded site! I initially built a personal
website for myself using Jekyll with the [Minima theme](https://github.com/jekyll/minima).
I never really went far into customization, just using the defaults.

But as I got more into web dev and started working on more complex projects,
and designing websites from scratch, I started to realize that the website
that I initially started work on in October 2018, when I'd just started
university wasn't really gonna cut it any more.

So, towards the beginning of this last academic year, I decided to build a
shiny new website. And then that didn't happen because I got distracted with
lots of other shiny projects, and coursework, and trying to have a social
life, and all that. But during lockdown, I was actually able to sit down and
build a new site from scratch.

## Tooling

So one of the main things I needed to decide before starting any work was
what tools I was going to build the site with.

Jekyll has kind of fallen out of style, and the whole JAMStack has become
hugely popular and complex. Tools like Netlify CMS and Forestry.io have made
it possible to hook up CMS-like backends to Git repositories, while more
powerful and flexible frameworks like Hugo and Gatsby have shown up.

Having struggled with some of the limitations of Jekyll when building other
sites, I decided I wanted to try something new. And because I've currently
been playing quite a bit with React, it made perfect sense to pick Gatsby.

## Styling

I didn't reallllly feel like writing CSS from scratch on this project. Not
because I don't enjoy doing so, or because I'm bad at it, but because I'm
currently doing a contracting job that involves fair amounts of it. So I
turned to looking for available CSS frameworks.

There's lots of awesome CSS frameworks out there, like the classic Bootstrap,
and property based CSS frameworks like Tailwind are becoming more and more
popular. However, I really wanted something that was minimal, looked good out
of the box, and was customizable. So I eventually decided on [Bulma](https://bulma.io/)
which satisfies all of that criteria.

Bulma is actually really nice, and it feels like a perfect fit for doing site
generation stuff, and it also integrates really well into React, just by
using the `className` property.

## Pages

So aside from the fact I had to have a homepage and a blog, I really wanted
to build some more complex pages.

I used to have a portfolio page on my old website, which used just pure
markdown, but I never really liked it. So this time, I went for a more modern
grid listing of different things I've done and helped organize. Annoyingly,
doing CSS Grid things in Bulma isn't so easy, so I had to suffer through
writing a couple of CSS classes to make up for it.

I also really wanted to attach a CV page. I'd worked on this earlier on in
lockdown, and converted from my old google doc into a single responsive HTML
page in Hugo. I preserved as much of the style of the CV as possible, as I've
been really happy with the general layout. Now instead of editing a google
doc to make changes, I just push a changed YAML file to GitHub, and it
automatically updates on my site. I had a lot of fun here trying to learn CSS
print styles, so that I could just print the page and use that as my printed
CV.

## Deployment

Two years ago when I built my site, the cool and popular thing was GitHub
pages. But it seems that nowadays, everyone's switching away to things like
Netlify, because they can build sites of any type, not just Jekyll.

While I initially experimented with deploying to GitHub pages, it just turned
out to be too much of a mess, and requiring quite a bit of manual
intervention. So I ended up giving Netlify a try, and am now totally
convinced and use it for both my main site and my CV site.

## Conclusion

Hopefully that's given you a good idea of the tech stack I've ended up using
for my site! You can see the source code [here](https://github.com/jedevc/website).
