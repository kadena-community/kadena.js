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

You must use the concrete `guard-policy` in conjunction with the `soul-bound-policy` to make sure only an authorized account can mint and burn the token.

## Timed mint policy

The timed mint policy enables the minting of tokens within a specific time window. 
This policy restricts the minting of tokens to a predefined period and provides control over the minting process.

## Private token policy

The private token policy allows you to create a token airdrop without revealing the metadata of the token beforehand. 
You can then reveal the token URI and its corresponding metadata at any time after the initial airdrop event.

You must use the concrete `guard-policy` in conjunction with the `private-token-policy` to make sure only an authorized account can update the token URI.

If you use this policy to create a token, the token URI should be the hash of the actual URI. 
You can calculate the hash using a local call to the Chainweb node so there is no trace of the URI recorded on the chain.
Revealing the initial URI updates the blockchain database and emits an event. 
You can update the URI after it's been revealed if you have an account with permission to update the URI.
Note: token URI can still be updated by the uri-guard but only after r