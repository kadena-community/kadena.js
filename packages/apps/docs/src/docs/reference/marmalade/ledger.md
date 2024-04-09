---
title: Ledger contract
description: Functions and capabilities defined in the Marmalade Ledger contract enable you to manage the token lifecycle and keep track of all token-related activity.
menu: NFT marketplace reference
label: Ledger
order: 1
layout: full
---

# Ledger contract

The Marmalade token standard provides interfaces that enable you to define, mint, and secure tokens.
As discussed in [Layered contract architecture](/build/nft-marmalade/architecture), the Marmalade ledger contract provides the core functionality to create, manage, and transfer tokens minted using the Marmalade token standard.
The ledger contract records and manages all token-related activity to ensure every transaction is accurate, every policy is enforced, and every account is up-to-date.

This part of the documentation describes the functions and capabilities defined in the Marmalade ledger contract.

Source code: [ledger.pact](https://github.com/kadena-io/marmalade/blob/v2/pact/ledger/ledger.pact)

## create-token-id

Use `create-token-id` to generate a unique token identifier with the specified token identifier.

### Arguments

Use the following arguments to create the token identifier.

| Argument | Type | Description
| -------- | ---- | -----------
| `details` | object | Defines token properties using the metadata schema in JSON file format.
| `creation-guard` | guard | Specifies the temporary guard—for example, a keyset—used to generate the token identifier. This guard isn't stored and ensure that only the  owner of the creation key can create a specific token identifier.

Before creating a token, you must choose a temporary guard.
The guard can be

- A keyset you've already defined or used in the guard-policy.
- A single-use keyset that won't be used again.
- Another type guard.

This guard becomes part of the hashed data in the `token-id` string prefixed with `t:`. 
Including the guard in the hashed token identifier protects anyone else from creating the token. 
With this mechanism, only you—as the owner of the creation key—can create the token specified by the `token-id` string.

### Example

Generate a unique `token-id` by calling the following function:

`(ledger.create-token-id details creation-guard)`

## create-token

Use `create-token` to create a token with the specified token identifier. 

### Arguments

Use the following arguments to create a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using the `create-token-id` function and formatted as `t:{token-detail-hash}`. 
| `precision` | integer | Specifies the number of decimals allowed for the token supply amount. For non-fungible tokens, the precision must be 0, and should be enforced in the policy's `enforce-init`.
| `uri` | string | Specifies the uniform resource identifier (uri) to an external JSON file containing token metadata.
| `policies` | list| Specifies one or more policy contracts with custom functions to execute at marmalade functions
| `creation-guard` | Specifies the temporary guard—for example, a keyset—used to generate the token identifier. This guard isn't stored and ensure that only the  owner of the creation key can create a specific token identifier.

To create a token with this function:

- Generate a unique `token-id` by calling `(ledger.create-token-id details creation-guard)`
- Create the token by calling `(ledger.create-token ... creation-guard)`
  
  The `create-token` transaction must include the `TOKEN` capability signed with the keyset `creation-guard` that you used to generate the token identifier.

## mint

Use `mint` to mint the specified token amount to the specified account.

### Arguments

Use the following arguments to mint a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
|  `account` | string | Specifies the account that will receive the minted token.
| `guard` | guard | Specifies the guard for the minted token account.
| `amount` | decimal | Specifies the number of tokens to be minted.

When you submit the `mint` transaction, the `policy-manager.enforce-mint` function calls the `policy:enforce-mint` function in the stored token policies and the function is executed at `ledger.mint`.

## burn

Use `burn` to destroy the specified token amount from the specified account.

### Arguments

Use the following arguments to burn a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
|  `account` | string | Specifies the account where the token will be destroyed.
| `amount` | decimal | Specifies the number of tokens to be burned.

When you submit the `burn` transaction, the `policy-manager.enforce-burn` function calls the `policy:enforce-burn` function in the stored token policies and the function is executed at `ledger.burn`.

## transfer

Use `transfer` to transfer the specified token amount from the specified sender to the specified receiver.

### Arguments

Use the following arguments to transfer a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
| `sender` | string | Specifies the sender account that the token will be transferred from.
| `receiver` | string | Specifies the receiver account that the token will be transferred to.
| `amount` | decimal | Specifies the number of tokens to be transferred.

When you submit the `transfer` transaction, the `policy-manager.enforce-transfer` function calls the `policy:enforce-transfer` function in the stored token policies and the function is executed at `ledger.transfer`.

## sale

Use `sale` to execute a two-step transaction using the offer and buy steps with an escrow account as described in [Token sales and trustless-escrow](/build/nft-marmalade/what-is-marmalade#token-sales-and-trustless-escrowh1493505976).

Because a sale requires two steps that must be completed in a specific order, the transaction is defined using a pact.
For information about the syntax used to define a pact, see [defpact](/reference/syntax#defpacth1545231271).

### Arguments

Use the following arguments to initiate the sale of a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
| `seller` | string | Specifies the seller account that the token will be offered from.
| `amount` | decimal | Specifies the number of tokens to be offered for sale.
| `timeout` | integer | Specifies when the offer is set to expire in the number of blocks that must be mined before the offer can be withdrawn. The `timeout` argument is optional. If not specified, an offer can be withdrawn at any time by the token owner.

### offer

The first step of a `sale` pact (step 0) executes the `offer` function. 
The `offer` function transfers the token from the seller's account to the escrow account.

The `policy-manager.enforce-offer` function calls the `policy:enforce-offer` function in the stored token policies and the function is executed at step 0 of the `sale`.

### withdraw (cont)

The `sale` pact includes a rollback step (step 0-rollback). 
The rollback step executes the `withdraw` function. 
The `withdraw` function transfers the tokens held in the escrow account for the sale back to the seller. 
If a `timeout` is specified, the `withdraw` function can only be executed after the timeout period has passed.
You can execute the `withdraw` function by sending a continuation (`cont`) command with the following information:

```yaml
pactTxHash: sale-pact-id
step: 0
rollback: true
```

For more information about formatting continuation commands, see 
[YAML Continuation command request](/reference/rest-api#yaml-continuation-command-requesth-2127282742)

The `policy-manager.enforce-withdraw` function calls the `policy:enforce-withdraw` function in the stored token policies and the function is executed at step 0-rollback of `sale`.

### buy (cont)

The second step of a `sale` pact (step 1) executes the `buy` function. 
The `buy` function transfers the tokens held in the escrow account to the buyer. The `buy` function can be executed before `timeout`. 
The `buyer` and `buyer-guard` information is read from the `env-data` of the command instead of passing in arguments. 
Like the `withdraw` function, the `buy` function is executed using a continuation (`cont`) command:

```yaml
pactTxHash: sale-pact-id
step: 0
rollback: false
```

The `policy-manager.enforce-buy` function calls the `policy:enforce-buy` function in the stored token policies and the function is executed at step 1 of `sale`.
