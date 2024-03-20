---
title: Concrete Policies
description: What are policies
menu: Concrete Policies
label: Overview
order: 4
layout: full
---

# Policies and Implementations

In Marmalade V2, policies play a pivotal role in defining the behavior and
attributes of tokens. Policies enable creators to exercise granular control over
token functionalities, including minting, burning, transferring, buying.

## Introduction

The Marmalade V2 ecosystem introduces two types of policies: **Concrete
Policies** and **Custom Policies**. Both types adhere to the same
[`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/token-policy-v2.pact)
interface, ensuring consistency and versatility in token behavior.

### **Concrete Policies**

A concrete policy in Marmalade V2 is a pre-built, ready-to-use implementation of
commonly used features in token creation. It simplifies the process of adding
functionality to NFTs and offers convenience for token creators. With concrete
policies, Marmalade aims to provide a rich set of features that can be easily
added to tokens without the need for extensive custom development.

**Available Concrete Policies:**

1.  **Guard Policy**: Ensures initiation of a guard with each activity,
    bolstering security against unauthorized minting.
2.  **Collection Policy**: Facilitates the creation of predefined token lists
    for easier categorization.
3.  **Non-fungible Policy**: Renders a token unique by setting its supply to 1
    and precision to 0.
4.  **Royalty Policy**: Allows creators to designate a royalties recipient
    account, fostering an ongoing revenue stream from NFT sales.

These policies streamline token creation, allowing creators to enhance their
NFTs with capabilities effortlessly.

### **Custom Policies**

Custom policies allow creators to implement unique rules and checks tailored to
their requirements. The utilization of custom policies offer more flexibility
and can be altered as per the token creator's vision.

\* When creating a custom policy it should always adhere to
[`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/token-policy-v2.pact)

## Technical Overview: Implementing Policies

Regardless of whether a policy is concrete or custom, its implementation
revolves around the `token-policy-v2` interface, which outlines specific
functions that govern token behavior.

**Getting Started**:  
To use this interface, you first need to import it into your Pact code using the
following command:

```pact
(namespace 'my-namespace)
(import 'marmalade-v2.token-policy-v2)
```

**Policy Enforcement Functions**:  
Once the interface is integrated, you can enforce policies through these
functions:

`enforce-mint`: Governs token minting. 
`enforce-burn`: Regulates token burning.
`enforce-init`: Handles token initialization. 
`enforce-offer`: Manages token offering for sale. 
`enforce-buy`: Controls purchasing of tokens offered for sale. 
`enforce-transfer`: Administers token transfers between accounts.

Each function requires specific parameters related to the token object. 
By implementing custom checks within these functions, creators can tailor their
tokens' behavior.
