---
title: Create custom policies
description: Describes how to import and work with token policy interfaces to create custom token policies.
menu: Policies
label: Use concrete policies
order: 4
layout: full
---

# Create custom policies

In additions to the concrete and example policies, you can use the interfaces defined in the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v2.pact) standard to create custom policies.

Custom policies allow you to implement rules and checks that are tailored to your specific requirements. 
To implement a custom policy, you first need to import the functions and interfaces defined in `token-policy-v2`.

To create a custom policy:

1. Create a `.pact` file to contain the policy.
   For example, create a file called `my-custom-mint.pact`.

2. Import the `token-policy-v2` interfaces by adding lines similar to the following to the file:

   ```pact
   (namespace 'my-namespace)
   (import 'marmalade-v2.token-policy-v2)
   ```

3. Use the following functions to define when policies are enforced:
   
   `enforce-mint`: Governs token minting. 
   `enforce-burn`: Regulates token burning.
   `enforce-init`: Handles token initialization. 
   `enforce-offer`: Manages token offering for sale. 
   `enforce-buy`: Controls purchasing of tokens offered for sale. 
   `enfore-withdraw`: Defines the withdraw policy.
   `enforce-transfer`: Administers token transfers between accounts.

   Each function requires specific parameters related to the token object. 
   By implementing custom checks within these functions, you can control what happens during each phase of token activity.
