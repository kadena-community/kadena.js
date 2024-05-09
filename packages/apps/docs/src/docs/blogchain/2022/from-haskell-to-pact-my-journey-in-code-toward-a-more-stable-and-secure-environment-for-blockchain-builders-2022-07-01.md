---
title:
  From Haskell to Pact - My Journey in Code Toward a More Stable and Secure
  Environment for Blockchain Builders
description:
  As a programmer for the past three decades, I’ve seen a lot of epic changes in
  technology — from my early days writing C++ parsers for Borland at the dawn of
  the internet to surfing the Web 2.0 wave with Java J2EE-based web applications
  and microservices on Haskell. In the last decade I’ve migrated fully to
  functional programming, building both production systems in Haskell and
  formally verified models in Coq.
menu:
  From Haskell to Pact - My Journey in Code Toward a More Stable and Secure
  Environment for Blockchain Builders
label:
  From Haskell to Pact - My Journey in Code Toward a More Stable and Secure
  Environment for Blockchain Builders
publishDate: 2022-07-01
headerImage: /assets/blog/1_VuAQP0wMbSn4odUtYSg97w.webp
tags: [pact]
author: John Wiegley
authorId: john.wiegley
layout: blog
---

# From Haskell to Pact: My Journey in Code Toward a More Stable and Secure Environment for Blockchain Builders

_The blockchain cannot be described just as a revolution. It is a tsunami-like
phenomenon, slowly advancing and gradually enveloping everything along its way
by the force of its progression — William Mougayar_

As a programmer for the past three decades, I’ve seen a lot of epic changes in
technology — from my early days writing C++ parsers for Borland at the dawn of
the internet to surfing the Web 2.0 wave with Java J2EE-based web applications
and microservices on [Haskell](https://www.haskell.org/). In the last decade
I’ve migrated fully to functional programming, building both production systems
in Haskell and formally verified models in Coq.

As the newest engineering team member at Kadena, I’m now happily wrapping my
head around [Pact](/build/pact), Kadena’s open-sourced smart contract
programming language. Not only is it a privilege to be part of such an amazing
community, but something truly transformational is underway. Thanks to
connections built earlier in my career, my path to Kadena came into clear view
at the right time. Here at Kadena I’m able to pursue my aspiration of creating a
more stable and secure environment for blockchain builders.

**Early cryptography: Haskell, government contracts, and formal proofs**

I’ve had a pretty long and complex career in code, traversing many languages and
applications that ranged from straight C-style languages, to object-oriented and
functional styles of programming. But it wasn’t until 2013 that I started
digging into Haskell, which became my entry point into proof systems and smart
contracts.

This started when I went to work at
[BAE Systems](https://www.baesystems.com/en-us/home), a large DARPA government
contractor, where I spent the next four years focused on software verification.
I spent many happy days on proofs during this time, while also writing
traditional tests. One of the anecdotes I like to share is how, while writing a
register allocator and its corresponding test suite, I managed to find a subtle
bug in the 8.2 billionth program that the testing framework generated. Of
course, I fixed the bug but the reason I like this example is because it shows
the tragic incompleteness of unit testing compared to proof. In the world of
DARPA, we strove to write proofs that would make such testing unnecessary,
because the math then convinced us that such software would never fail. The key
difference, of course, being the engineering cost, and so I’ve spent my career
since then looking for ways to mitigate those costs.

The realm of testing and formal proofs got me interested more in using Haskell
also as a functional tool for dipping into theoretical research. I began to
appreciate the beauty of math in computer programming, and studied category
theory and abstract algebra to start applying those principles to better
engineering design. I didn’t realize it fully at the time, but this was my early
foray into cryptography and the nature of smart contracts. What essentially
fascinated me was the “math to implementation” pipeline and how proofs can be
used to connect these two. I kept a blog of articles where I documented my
research and insights, including my work on
[recursion schemes](http://newartisans.com/2018/04/win-for-recursion-schemes/).

In 2018, I joined a non-profit named [DFINITY](https://dfinity.org/) that was
interested in doing proof work on blockchain. During my four years there, I
assumed a variety of roles and opportunities ranging from verification engineer
to technical lead for a variety of teams. I solidified my blockchain proof work
and modeling experience during this tenure using Haskell, Rust and Coq.

**Meeting of the minds**

With some of this technical background in mind, allow me to jump back to
around 2013. That was the year I first met
[Doug Beardsley](https://www.linkedin.com/in/doug-beardsley-627b275/) at the
first
[International Conference on Functional Programming](https://www.icfpconference.org/)
in Boston, MA. Introduced through a mutual friend, Doug and I kept in touch —
he’s a friendly guy and we’ve become engineering friends over the years.

When Doug made the jump over to Kadena in 2018, I remembered hearing about some
of the compelling things that his new company was doing with formal
verification, specifically using Z3 for automated model checking. So I was
delighted when earlier this year Doug reached out and reminded me that there was
a two-year-old position for a Pact verification engineer that was still open. By
this time, I had also started talking to Kadena co-founder and CEO Stuart
Popejoy; the three of us had a chat group going where we’d discuss all things
related to blockchain verification, semantics, and system behaviors. From these
sessions, I could tell each of these topics were close to their heart and part
of the deeper vision for creating the world’s first scalable proof of work (PoW)
layer-1 smart contract.

**Pact, recursion-freedom, and the promise of a decentralized future**

Serendipity or otherwise, I’m now immersed in understanding the smart contract
language that could very well become the future of secure contracts on
blockchain. I first heard about Pact at a conference in 2017 where Stuart
described his purely functional contract language as a means to empower people
to enact meaningful events on a blockchain, safely and quickly.

I believe that Pact is important on many levels. For example, I appreciate how
Stuart made lots of conservative choices upfront — for instance, eliminating
[recursive functions](https://www.geeksforgeeks.org/recursive-functions/) to
avoid the kinds of
[re-entrancy attacks we’ve seen in Solidity](https://jeancvllr.medium.com/solidity-tutorial-all-about-functions-dba2ccb1e931#:~:text=Recursive%20functions%20are%20dangerous%20in,is%20reached%2C%20the%20function%20stops.).
Programmers who have worked on financial systems in the past will likely
appreciate the absence of recursion in a smart contract language because it’s a
[disaster](https://www.gemini.com/cryptopedia/the-dao-hack-makerdao#section-origins-of-the-dao)
waiting to happen.

One of my major goals at Kadena is to absorb everything I can about the current
state of the system, and then to start comparing that to our future vision. We
must keep asking ourselves: what changes and revisions do we need to bring the
platform to the next level of security, scalability, and accessibility?

Another area I’m particularly intrigued by is Kadena’s future growth and
influence on Web3 and the dapps that spin off from it. In other words, how
Kadena can be applied across various industries and become first to market in
those some of those sectors. By focusing on reliable smart contracts, Kadena can
become a natural fit where security and trustworthiness are paramount: such as
DeFi, NFT sales, and other marketplaces where the importance of reliability has
been amply demonstrated by many recent hacks and thefts.

If you’re running a financial organization and are now convinced that a ledger
on blockchain is a big win for your organization, then the choice between
Ethereum Virtual Machine (EVM) or Pact should be clear.

**Leveraging connections, building consensus: Bringing it all together**

For years, I’ve been involved in open-source initiatives, and have done a lot of
evangelism for platforms that I’m passionate about. For instance, I’ve been
involved in Emacs for almost my entire career, and have spent a decade in the
Nix, Haskell, and Coq communities, conducting many meetups, giving
presentations, and staying active on forums.

I feel that I’ve been given this amazing opportunity to leverage these
connections and evangelize the benefits of Pact, and have a chance now to help
build consensus and community around the Kadena product and roadmap. Some in the
open-source community might know me for my work in formal verification, so now
will be a time to help interface Kadena with the broader communities I belong
to.

I’m really excited to be here at Kadena and can’t wait to see what great things
we’ll all achieve together. I look forward to chatting with you at a future
event, meetup, or conference. But there’s no need to wait until then; drop me a
line — to say hello, ask a question, or provide some feedback. I’d love to hear
from you. Find me at [john@kadena.io](mailto:john.wiegley@kadena.io).
