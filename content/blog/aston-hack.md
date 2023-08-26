---
title: "Aston Hack"
date: 2018-11-12
summary: >
  Another hackathon writeup, this time from Aston Hack. And also how I built
  a virtual theremin using the Web Audio API and Nintendo Joycons.
---

Following last week's hackathon at Hack the Midlands, this last weekend I went
to Aston Hack.

All my friends told me I was crazy for trying to do two in a row. Early in the
week, I laughed and said I'd be super prepared for it. But as the week
continued, and I continued to just feel tired, I became slighly less confident
that I'd be alive by the end of it.

Despite all that worry, it was a fantasic weekend, and I wouldn't have spend it
any differently. It was quite a bit smaller than Hack the Midlands, and much
more student oriented, especially since it was hosted at Aston university. That
meant there were fewer sponsors and fewer people to interact with, but it did
mean that it felt more personal and connected than at the larger Hack the
Midlands.

After getting there and getting a table setup for the team, we wandered around
the sponsors tables, looking for any interesting APIs or toolkits that we could
incorporate into our hack. Unfortunately, no one had anything that immediately
stood out (and we weren't about to try getting a domain.com address after
completely failing to do so last time). So we settled on building something not
at all related to any of the sponsors.

What we eventually decided to build was a virtual theremin in the browser,
controlled by the Nintendo Switch joycons. I worked on building the audio
synthesis side of things, while another member worked on building the
interface, and another worked on getting inputs.

What we hadn't realized before starting is that getting the motion sensors into
the browser was going to be much harder than originally expected. While there
is a [Gamepad API][gamepad api] in browsers, it does not have any way to access
motion sensors. Additionally, many drivers that support the joycons on
computers do not have any support for motion control. So the only correct way
forwards, was to modify one of the existing drivers ([here][joycon driver]) to
instead output motion sensor data instead of the joystick data (naturally).

We finally got everything working and had an incredible demo to show off at the
end.

https://www.youtube.com/watch?v=rGMdvvvoX68

We all loved our project and had a great time building it. While building it,
we had quite a few people stop by and ask what we were up to. We explained it,
always having a quick demonstration and explanation - what we didn't realize
was that many of these people were judges. We somehow managed to convince
enough of them that our project was awesome, and as a result won best hack of
the weekend.

I feel that this last hackathon went much more smoothly than my last one, now
that I know how everything works, how to pace yourself and how to make sure you
have a good time. I even got a chance to sleep :)

If you're interested in looking at our project yourself, you can find it on
github [here][project link].

[aston hack]: https://astonhack.co.uk/
[gamepad api]: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
[joycon driver]: https://github.com/riking/joycon
[project link]: https://github.com/wrussell1999/aston-hack-2018
