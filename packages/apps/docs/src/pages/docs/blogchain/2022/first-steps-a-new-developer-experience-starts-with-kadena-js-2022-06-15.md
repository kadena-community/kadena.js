---
title:
  Kadena Eco is excited to present a new developer experience with Kadena.JS.
description:
  We’re on the verge of a new and improved front-end experience at Kadena! It’s
  time to let the community in on how our innovation network, Kadena Eco, is
  turbocharging R&D efforts to improve our front-end ecosystem and what lies
  ahead in the coming months. Because we believe that our community members can
  best help us when they are informed. So along with developing a stellar new
  front end, another key job is keeping our community apprised every step of the
  way.
menu:
  Kadena Eco is excited to present a new developer experience with Kadena.JS.
label:
  Kadena Eco is excited to present a new developer experience with Kadena.JS.
publishDate: 2022-07-15
author: Randy Daal
layout: blog
---

![Kadena Eco is bringing a new developer experience with Kadena.JS](/assets/blog/1_IlvgBc3Vwf6D4tc631_h2A.webp)

# Kadena Eco is excited to present a new developer experience with Kadena.JS.

> _“Coming together is a beginning, staying together is progress, and working
> together is success.”  
> Henry Ford_

We’re on the verge of a new and improved front-end experience at Kadena! It’s
time to let the community in on how our innovation network, Kadena Eco, is
turbocharging R&D efforts to improve our front-end ecosystem and what lies ahead
in the coming months. Because we believe that our community members can best
help us when they are informed. So along with developing a stellar new front
end, another key job is keeping our community apprised every step of the way.

First off: we are currently creating a couple of new libraries that will replace
our golden olden — namely, the original library you may know as pact-lang-api.

Fun fact: pact-lang-api was created in late March 2019 and has served the
community well. But innovation is constant at Kadena. Although we may shed a few
tears, we plan to deprecate this library in the upcoming months. But don’t stay
sad for long — our new libraries will replace pact-lang-api with TypeScript
support out of the box under the name **Kadena.js!**

Kadena.js is a Monorepo (mono repository) where we will store all our
JavaScript/ TypeScript solutions for our blockchain (libs, tooling, dapps, and
so forth). Since we are still in Alpha, we want to get feedback from the
community to see how the Alpha is received.

On Friday July 15, we are going to release our first lib called:

cryptography-utils:

```
    *npm install @kadena/cryptography-utils*
```

which contains encode/decode/hash utils etc.

Our first milestone was the migration of pact-lang-api as is. So the community
can start using the library right from the get-go! But be aware at this stage we
are going to introduce some breaking changes to the SDK (until we make the
library final) to create a good foundation from which we can build an excellent
developer experience. So in the Alpha stage, our motto will be: “refactor early,
refactor often!” to create better readability, lower complexity, and better UX.

![Kadena.js roadmap up till 1.0.0 release](/assets/blog/1_QS7cr-peW81749ZBv24bYQ.webp)

In the upcoming months, we are going to add several more:

- @kadena/chainweb-node-client typed js wrapper to call chainweb-node API
  endpoints

- @kadena/pact-core low-level generator for pact expressions

- @kadena/pact-cli cli to generate pact contract type definitions and interface
  to pact client deployment of contracts (apparently the community is already
  building this 👌)

- @kadena/pact-client wrapper around chainweb-node-client with the ability to
  switch environments

- @kadena/wallet-client client for a wallet to sign, connect, retrieve account
  info

- @kadena/marmalade-client — a Marmalade SDK in typescript

We are especially looking forward to @kadena/pact-core to give our module
function calls a more TypeScript feel — e.g. this example:

![The API isn’t clear but the ideas and POC are in progress. And will be part of a release in the far future.](/assets/blog/1_0uzrG6_R0AKad-68YRyU_Q.webp)

As abstraction layers will become more critical for a better and faster
development experience, we first need to focus on getting the implementation
details ready. Now that these are ready with our first Alpha release, we will
work on making it easy for developers to use our ecosystem on the front-end
side.

In the end, Kadena.js will exist with a lot of consumer-level functionalities.
Wouldn’t it be great if we could just call one function to transfer assets from
one account to another?

We hope you are fond of these new releases from Kadena Eco and help us prepare
these libraries for production usage! Please share your feedback with us on our
[Discord channel](http://discord.io/kadena), on our
[GitHub repository](https://github.com/kadena-io/), or by contacting me directly
at [randy at kadena.io](mailto:randy@kadena.io).
