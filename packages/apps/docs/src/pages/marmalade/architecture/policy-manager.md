---
title: Policy Manager
description: The Power of the Policy Manager in Marmalade V2
menu: Policy Manager
label: Policy Manager
order: 2
layout: full
---

# Policy Manager

Marmalade V2 introduces the
[Policy manager](https://github.com/kadena-io/marmalade/blob/v2/pact/policy-manager/policy-manager.pact),
a powerful tool that revolutionizes how policies are managed, but also enabling
stacking of policies for non-fungible tokens (NFTs). The Policy Manager serves
as the repository for these policies. If a general-purpose policy gains
widespread acceptance, it could be incorporated as a concrete policy. This
allows dApps, marketplaces, or wallets to readily identify token properties,
such as collections, non-fungibility, or royalty specifications, by leveraging
the concrete policies stored in the Policy Manager.

## Key Features of the Policy Manager

**1. Policies Tailored to You**

With the Policy Manager, you can add (manage) policies that match your unique
use cases. These policies define the behavior and attributes of your NFTs.

**2. Dynamic Implementation with Concrete Policies and Custom Policies**

**Concrete Policies**: These are the default policies provided by Marmalade's
creators, representing the most commonly used functionalities in token creation.
They are immutable and written and maintained by the Marmalade team.

**Custom Policies**: In addition to concrete policies, you can create custom
policies that provide additional functionality. Once established, these policies
are also immutable and can be added during token creation.

With the Policy Manager, you can stack multiple policies and associate them with
tokens. This unprecedented flexibility allows NFTs to accommodate N number of
policies, enabling you to create dynamic and sophisticated tokens.

**3. Type Checking for Policy Validation**

To ensure the correctness of your policies, the Policy Manager provides
type-checking functionality. This feature identifies any inconsistencies or
discrepancies between abstract policies and their concrete implementations,
safeguarding the integrity of your NFT ecosystem.

**4. Policy Enforcement via
[kip.token-policy-v2](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/token-policy-v2.pact)
Interface**

Each policy is enforced by the Policy Manager following the
`kip.token-policy-v2` interface. This standardized interface ensures consistent
and reliable enforcement of policies across the Marmalade ecosystem.

---

With the Policy Manager and its support for policy stacking, you can craft
sophisticated and innovative NFTs that push the boundaries of creativity and
functionality. As you embark on this exciting journey, we await your innovative
ideas and creativity to further enrich the NFT experience within Kadena's
Marmalade ecosystem. Happy crafting!
