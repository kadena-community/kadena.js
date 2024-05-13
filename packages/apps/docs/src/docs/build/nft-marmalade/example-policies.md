---
title: Explore example policies
description: Describes where to find and how to work with example policies.
menu: Policies
label: Explore example policies
order: 1
layout: full
---

# Explore example policies

All token policies are implemented based on the interfaces defined in the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v2.pact) standard.
In addition to the **concrete policies** that are officially released and maintained, there are several example policies that you can experiment with and use as models for defining your own custom policies.
You can find these example policies in the [examples/policies](https://github.com/kadena-io/marmalade/tree/main/examples/policies) repository.

Each example policy includes technical reference information, a `.repl` file for testing its behavior, and the .pact module containing the smart contract module for the policy. 

## Fixed issuance policy

The fixed issuance policy provides a simple example of how you can create a fractional token. 
Because there are many ways you can write the logic to create fractional tokens, the contract only provides the simplest feature that is required for fractional tokens.

## Onchain manifest policy

The onchain manifest policy allows you to store a manifest file for a `marmalade-v2` token onchain. 
The policy implements the `kip.token-policy-v2` interface and enables the management of token manifests on the blockchain.

## Soul-bound policy

The soul-bound policy provides a simple method to bind a token to one and only one account. 
In this context, a soul-bound token refers to a token that is uniquely associated with a specific account.
A token created with the soul-bound policy can be initiated, minted, and burned, but cannot be sold or transferred.
In addition, the token can only ever be minted once, even if the token is burned in the future.

You must use the concrete `guard-policy` in conjunction with the soul-bound policy to make sure only an authorized account can mint and burn the token.

## Timed mint policy

The timed mint policy enables the minting of tokens within a specific time window. 
This policy restricts the minting of tokens to a predefined period and provides control over the minting process.