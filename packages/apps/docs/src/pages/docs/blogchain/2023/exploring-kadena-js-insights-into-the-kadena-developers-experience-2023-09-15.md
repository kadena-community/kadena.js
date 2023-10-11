---
title: Exploring Kadena.js — Insights into the Kadena Developer’s Experience
description:
  In this article, we’ll walk you through our collective journey within Kadena’s
  extensive open-source ecosystem. We’ll share insights and experiences from
  across our team who are actively engaged in different projects. Although we
  have numerous projects underway, this article will focus on Kadena Client,
  Chainweb Stream, Kadena Tools, and our new Kadena React UI Components.
menu: Exploring Kadena.js — Insights into the Kadena Developer’s Experience
label: Exploring Kadena.js — Insights into the Kadena Developer’s Experience
publishDate: 2023-09-15
headerImage: /assets/blog/2023/0_FSpTcZA-5Pz-8NXq.png
tags: [kadenajs, services]
author: Glenn Reyes
authorId: glenn.reyes
layout: blog
---

# Exploring Kadena.js — Insights into the Kadena Developer’s Experience

Hello Kadenians! If you’ve been following our recent updates
(**[Kadena Q2 Newsletter](/docs/blogchain/2023/kadena-2023-q2-newsletter-2023-07-06)**,
**[Kadena Campfire — Community Call with Randy & Anastasia](https://youtu.be/IN8qx_6DgJU)**),
you’re already in the loop! Our Developer Experience team has expanded
substantially over the past year. With our incredible team of talented
developers, we’ve dedicated ourselves to an array of projects geared towards
enriching our ecosystem and elevating your experience within it.

In this article, we’ll walk you through our collective journey within Kadena’s
extensive open-source ecosystem. We’ll share insights and experiences from
across our team who are actively engaged in different projects. Although we have
numerous projects underway, this article will focus on Kadena Client, Chainweb
Stream, Kadena Tools, and our new Kadena React UI Components.

Let’s dive right in!

## The Kadena Client

The
[Kadena Client](https://github.com/kadena-community/kadena.js/blob/master/packages/libs/client/README.md)
is our Javascript/Typescript library that enables users to interact effortlessly
with the Kadena Blockchain. This is especially useful for managing accounts and
transferring tokens.

![](/assets/blog/2023/1_cTjcaBJ0qQISAFt23MEYMw.webp)

Kadena Client 1.0 is our latest iteration of the JavaScript interface and is an
extremely functional and composable API, allowing for increased flexibility and
customization for builders and users. Notably, this release also includes
WalletConnect as a signing method, based on
[KIP-0017](https://github.com/kadena-io/KIPs/blob/master/kip-0017.md).

You can learn more about the Kadena Client by checking the
[source code](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client).

Make sure to check out how you can generate a typesafe client by using the
[@kadena/pactjs-cli](https://github.com/kadena-community/kadena.js/tree/main/packages/tools/pactjs-cli)
that accompanies the
[@kadena/client](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client).

### **Chainweb Stream**

![](/assets/blog/2023/0_TtpBFbOxE7t1oOA7.png)

Chainweb Stream plays a crucial role in our ecosystem by providing real-time
updates from the Chainweb API. It is instrumental in keeping our applications in
sync with the blockchain, particularly for building dynamic applications.

Click
[here](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-stream-client)
to learn how to integrate Chainweb Stream into your applications today!

### Kadena Tools

![](/assets/blog/2023/0_LVaoFVpypwNt2njo.png)

We’ve been working on a Kadena Tools DApp, which allows users to interact in the
Kadena blockchain through several features. This includes generating key pairs,
checking for account balance, transferring tokens, the module explorer, managing
accounts, and more.

This project is a work in progress, but if you want to learn more about it, feel
free to
[check out the source code](https://github.com/kadena-community/kadena.js/tree/main/packages/apps/tools).

### New Kadena Docs

![](/assets/blog/2023/0_s-vXIU_stFVOsfim.png)

The Kadena Documentation (Kadena Docs) will be a new resource designed to cover
every facet of Kadena, from basic to advanced topics.

While our current docs include extensive content that might seem overwhelming at
first glance, the new Kadena Docs will be meticulously organized, with
comprehensive indexing to facilitate a smooth learning process. Whether we’re
troubleshooting issues or exploring new features, we hope you will find the new
Kadena Docs to be an indispensable resource for new and existing builders! We
plan to release our docs around Q4 in 2024!

Be sure to follow our CXO, [Randy Daal](https://twitter.com/Randynamic_4), on
Twitter for exciting updates and sneak peeks!

## Kadena 🤍 React — New React UI Component Library for Kadena

Over the past months, we’ve been working hard building our React UI component
library. powered by [Vanilla Extract](https://vanilla-extract.style/). It is
based on the unified design system for Kadena.

![](/assets/blog/2023/0_z09XwxCPbeesz6iu.png)

The UI component library is specifically created to align the UI of internal
Kadena projects. It is also open-sourced and available to the public. From
buttons to form elements to primitives to quickly building layouts and pages in
no time, the React UI Components are designed to ensure that all applications
maintain a uniform look and provide seamless functionality. The main goal of the
React UI Components is to make building our internal interfaces effortless so
that we can focus on adding unique features for apps on the Kadena blockchain.

In the future, we plan to build enhanced Kadena blockchain-specific components
on top of our primitive UI components with an elevated, familiar user
experience.

The UI component library is still being built, but if you’re curious, you can
check out the [UI component explorer](https://react-ui.kadena.io) and the
[source code](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/react-ui).

## Moving forward

Our journey in developing the Kadena ecosystem has been a collective one,
enriched with unique insights and learning opportunities. We are incredibly
proud of our team’s dedication and are also extraordinarily grateful for our
community’s feedback and unwavering support. From Chainweb Stream to the React
UI Components, each project reflects our commitment to providing an exceptional
developer and user experience.

By sharing our insights, we hope to shed a bit more light on our journey
building [kadena.js](https://github.com/kadena-community/kadena.js). Whether
you’re a seasoned developer or just getting your feet wet in the world of Web3
development, we invite you to explore our
[open-source projects](https://github.com/kadena-community) and discover the
exciting world of Kadena.
