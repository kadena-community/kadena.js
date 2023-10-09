---
title: Why Marmalade v2
description: Why did we decide to embrace this evolution from Marmalade v1 to v2
menu: Why Marmalade v2
label: Why Marmalade v2
order: 1
layout: full
---

# Why v2

So, why did we decide to embrace this evolution from Marmalade v1 to v2? It's
pretty simple - we're all about growth, innovation, and responding to the needs
of our vibrant community.

The digital world is ever-changing and full of exciting opportunities. To keep
you ahead of the curve, we need to be adaptable, we need to evolve, and most
importantly, we need to listen to you, our dedicated developers and users.

Next to our own provided well needed improvements the transition to v2 was a
also a response to your feedback, and your requirements. We heard you loud and
clear, and we incorporated your thoughts into these changes. Our aim? To make
Marmalade more functional, versatile, and user-friendly.

One of the major updates in v2 is the **Token Policy** model. We've moved away
from a single policy approach, and instead, we now support multiple policies.
This decision came about to accommodate a wider range of applications and
provide a more flexible environment - just like you asked.

We've also introduced a [Policy Manager](/docs/marmalade/the-policy-manager) to
manage these policies more efficiently. Instead of invoking functions directly
from each policy as we used to, we now call them from this central hub, making
policy enforcement smoother and more streamlined.

We've made the move from On-chain manifest to Off-chain URI to standardise token
data retrieval. We've also encouraged the use of IPFS for off-chain data hosting
for a more decentralized approach, which many of you advocated for.

And remember, we respect and value the diversity of our community. We know some
of you prefer to stick with on-chain manifests. Don't worry, we've got you
covered - just incorporate `onchain-manifest-policy-v1` into the
[policies](https://github.com/kadena-io/marmalade/blob/v2/pact/ledger.pact#L201C20-L201C20)
field at token creation, and you can continue as per usual. (please note,
marketplaces have no notion of the onchain-policy, since they follow our
off-chain metadata standard, if implemented correctly. devs would have to come
up with their own solution to interact with external marketplaces)

In summary, we're convinced that this shift to Marmalade v2 is a huge step
forward. It's not just about us, it's about you too. It's about embracing
change, optimising processes, and staying at the forefront of technological
progress.

---

Thank you for being part of our community and contributing to our growth. Your
feedback was instrumental in shaping v2 and we hope these changes bring about a
better, more seamless experience for everyone.

Remember, we're here to support you. If you need help during this transition,
check out our detailed
[technical guide](https://github.com/kadena-io/marmalade/blob/v2/migration.md)
on GitHub and don't hesitate to create a Github issue if you have any questions,
or join us on Telegram or Discord. Let's welcome this exciting new chapter
together. We're thrilled to be on this journey with you!
