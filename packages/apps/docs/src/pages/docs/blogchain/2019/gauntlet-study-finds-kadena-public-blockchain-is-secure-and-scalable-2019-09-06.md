---
title: Gauntlet Study Finds Kadena Public Blockchain is Secure and Scalable
description:
  Learn more about the findings from the IEEE peer-reviewed research paper
menu: Gauntlet Study Finds Kadena Public Blockchain is Secure and Scalable
label: Gauntlet Study Finds Kadena Public Blockchain is Secure and Scalable
publishDate: 2019-09-06
headerImage: /assets/blog/1_D0s4fdv1ko4Cx_DAmima_Q.webp
tags: [kadena]
author: Vivienne Chen
authorId: vivienne.chen
layout: blog
---

# Gauntlet Study Finds Kadena Public Blockchain is Secure and Scalable

### Learn more about the findings from the IEEE peer-reviewed research paper

[Kadena](http://kadena.io)’s upcoming public blockchain is a parallelized, Proof
of Work (PoW) blockchain that is more scalable and secure than existing
blockchains like Bitcoin and Ethereum. To validate Kadena’s security and
viability, we turned to [Gauntlet Networks](http://gauntlet.network), an
independent blockchain analysis firm using **agent-based simulations** to study
blockchain protocols. In an
[IEEE conference-accepted paper](https://arxiv.org/abs/1904.12924) presented in
Stockholm earlier this summer, Gauntlet and Kadena shared the findings.

Below are some of the key takeaways. **You can read
the[ full recap of the findings](https://medium.com/gauntlet-networks/analysis-of-kadenas-public-blockchain-protocol-31c66347e32e)
on Gauntlet’s blog** or the
[Forbes article](https://www.forbes.com/sites/darrynpollock/2019/04/29/high-frequency-trading-researcher-publishes-findings-on-jpmorgan-blockchain-spin-off/)
featuring our Head of Research & Networks,
[Monica Quaintance](http://twitter.com/QuaintM).

### Why Use Agent-Based Simulations?

Agent-based simulations (ABS) are used by researchers when the cost of
experimentation is high, but _estimating your risk accurately is critical for
success in production._ This is the case with public blockchain, where billions
of dollars in transactions are at stake. You’ll also find ABS used in
high-frequency trading analysis, macroeconomic modeling, and self-driving car
design.

ABS is well-suited for analyzing multi-chain blockchains like Kadena because
there are explicit correlations between cross-chain transactions and how miners
make decisions. Unlike single-chain blockchains, the parallelized, multi-chain
nature of our blockchain means standard probabilistic tools cannot be used to
create a closed-form proof.

### What is Kadena’s Public Blockchain? A Brief Overview

Kadena is a braided, PoW network currently in testnet. Based on Bitcoin’s PoW
protocol, Kadena hash-links multiple chains to provide additional security and
throughput. For more resources on understanding Kadena’s public blockchain,
refer to our [whitepaper](https://kadena.io/docs/chainweb-v15.pdf) and
[101 blog post](/docs/blogchain/2019/all-about-chainweb-101-and-faqs-2019-02-01).

![A ten-chain configuration of Kadena’s public blockchain, showing how merkle roots are propagated across chains at different blockheights.](/assets/blog/0_AgUQ6JQqbza3urwU.png)

### Key Findings

Gauntlet found that:

- Adversaries in the Kadena network experience much greater volatility than
  their honest counterparts, meaning that it is more costly to act maliciously.
  An actor is incentivized to participate in the network honestly if they want
  to get the most monetary rewards.

![](/assets/blog/0_FYwdK-o2Ytm14YYI.png)

- Honest, profit-maximizing agents beat out the censoring agents until those
  adversaries were in the majority (~50–60%). This security profile is largely
  similar to Bitcoin’s current PoW security, which is one of the strongest and
  most secure protocols among existing blockchains.

- Overall, Kadena’s chains appear difficult to censor given that there are
  enough rational, profit-maximizing miners in the system. Under many runs, a
  braided Proof of Work blockchain can securely scale with a network structure
  that economically benefits _all_ participants.

Want to learn more about Kadena’s public blockchain? We’re launching our mainnet
on October 30! Join our [Discord](http://discord.io/kadena) and sign up for our
newsletter below for updates.
