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
As discussed in [Contract architecture](/build/nft-marmalade/architecture), the Marmalade ledger contract provides the core functionality to create, manage, and transfer tokens minted using the Marmalade token standard.
The ledger contract records and manages all token-related activity to ensure every transaction is accurate, every policy is enforced, and every account is up-to-date.

This part of the documentation describes the functions and capabilities defined in the Marmalade ledger contract in the `marmalade-v2` namespace.
The  `marmalade-v2` namespace is available on all twenty chains (0-19) in the Kadena test network and the Kadena main network.

Source code: [ledger.pact](https://github.com/kadena-io/marmalade/blob/main/pact/ledger/ledger.pact)

## create-token-id

Use `create-token-id` to generate a unique token identifier with the specified token identifier.

### Arguments

Use the following arguments to create the token identifier.

| Argument | Type | Description
| -------- | ---- | -----------
| `details` | object | Defines token properties using the metadata schema in JSON file format.
| `creation-guard`&nbsp; | guard | Specifies the temporary guard—for example, a keyset—used to generate the token identifier. This guard isn't stored and ensure that only the  owner of the creation key can create a specific token identifier.

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
| `creation-guard` | guard | Specifies the temporary guard—for example, a keyset—used to generate the token identifier. This guard isn't stored and ensure that only the  owner of the creation key can create a specific token identifier.

When you submit the `create-token` transaction, the `policy-manager.enforce-init` function calls the `policy:enforce-init` function in the stored token policies and the function is executed.

To create a token with this function:

- Generate a unique `token-id` by calling `(ledger.create-token-id details creation-guard)`
- Create the token by calling `(ledger.create-token ... creation-guard)`

### Capabilities
  
The `create-token` transaction must include the `CREATE-TOKEN` capability signed with the keyset `creation-guard` that you used to generate the token identifier.
The `create-token` transaction also requires the `marmalade-v2.collection-policy-v1.TOKEN-COLLECTION` capability if you apply the collection-policy to create token.

Required capabilities and parameters for the `create-token` function:
- marmalade-v2.ledger.CREATE-TOKEN
  - id
- marmalade-v2.collection-policy-v1.TOKEN-COLLECTION
  - collection-id
  - token-id

## mint

Use `mint` to mint the specified token amount to the specified account.

### Arguments

Use the following arguments to mint a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
| `account` | string | Specifies the account that will receive the minted token.
| `guard` | guard | Specifies the guard for the minted token account.
| `amount` | decimal | Specifies the number of tokens to be minted.

When you submit the `mint` transaction, the `policy-manager.enforce-mint` function calls the `policy:enforce-mint` function in the stored token policies and the function is executed.

### Capabilities
  
The `mint` transaction must include the `MINT` capability signed with the `account` that receives the token.
The `mint` transaction also requires the `marmalade-v2.guard-policy-v1.MINT` capability if you apply the guard-policy and define a mint guard for the token.

Required capabilities and parameters for the `mint` function:
- marmalade-v2.ledger.MINT
  - id
  - account (receiver of the token)
  - amount

- marmalade-v2.guard-policy-v1.MINT
  - token-id
  - account (receiver of the token)
  - amount 

## burn

Use `burn` to destroy the specified token amount from the specified token owner account.

### Arguments

Use the following arguments to burn a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
|  `account` | string | Specifies the token owner account for the token amount to be burned.
| `amount` | decimal | Specifies the number of tokens to be burned.

When you submit the `burn` transaction, the `policy-manager.enforce-burn` function calls the `policy:enforce-burn` function in the stored token policies and the function is executed.

### Capabilities
  
The `burn` transaction must include the `BURN` capability signed with the `account` that owns the token.
The `burn` transaction also requires the `marmalade-v2.guard-policy-v1.BURN` capability if you apply the guard-policy and define a burn guard for the token.

Required capabilities and parameters for the `burn` function:
- marmalade-v2.ledger.BURN
  - id
  - account (owner of the token)
  - amount
- marmalade-v2.guard-policy-v1.BURN
  - token-id
  - account (owner of the token)
  - amount

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

When you submit the `transfer` transaction, the `policy-manager.enforce-transfer` function calls the `policy:enforce-transfer` function in the stored token policies and the function is executed.

### Capabilities
  
The `transfer` transaction must include the `TRANSFER` capability signed with the `sender` that owns the token.
The `burn` transaction also requires the `marmalade-v2.guard-policy-v1.TRANSFER` capability if you apply the guard-policy and define a transfer guard for the token.

Required capabilities and parameters for the `transfer` function:
- marmalade-v2.ledger.TRANSFER
  - id
  - sender
  - receiver
  - amount
- marmalade-v2.guard-policy-v1.TRANSFER
  - token-id
  - sender
  - receiver
  - amount

## sale

Use `sale` to execute a two-step transaction using the offer and buy steps with an escrow account as described in [Token sales and trustless-escrow](/build/nft-marmalade#token-sales-and-trustless-escrowh1493505976).

Because a sale requires two steps that must be completed in a specific order, the transaction is defined using a pact.
For information about the syntax used to define a pact, see [defpact](/reference/syntax#defpacth1545231271).

### Arguments

Use the following arguments to initiate the sale of a token.

| Argument | Type | Description
| -------- | ---- | -----------
| `id` | string | Specifies the unique token identifier generated using `create-token-id` function and formatted as `t:{token-detail-hash}`. 
| `seller` | string | Specifies the seller account that the token will be offered from.
| `amount` | decimal | Specifies the number of tokens to be offered for sale.
| `timeout` | integer | Specifies when the offer is set to expire using a timestamp for the number of seconds from UNIX epoch before the offer can be withdrawn. For example, if you want an offer to expire at midnight on 30 June 2024, you specify the timeout as 1719705600. You can set the `timeout` argument to zero (0) to allow an offer to be withdrawn at any time by the token owner.

### offer

The first step of a `sale` pact (step 0) executes the `offer` function. 
The `offer` function transfers the token from the seller's account to the escrow account.

The `policy-manager.enforce-offer` function calls the `policy:enforce-offer` function in the stored token policies and the function is executed at step 0 of the `sale`.

#### Capabilities
  
The `offer` transaction must include the `OFFER` capability signed with the `seller` that owns the token.
The `offer` transaction also requires the `marmalade-v2.guard-policy-v1.SALE` capability if you apply the guard-policy and define a sales guard for the token.

Required capabilities and parameters for the `offer` function:

- marmalade-v2.ledger.OFFER
  - id
  - seller
  - amount
  - timeout

- marmalade-v2.guard-policy-v1.SALE
  - token-id
  - seller
  - amount

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


#### Capabilities
  
The `withdraw` transaction must include the `WITHDRAW` capability signed with the `seller` that owns the token.
The `withdraw` transaction also requires the `marmalade-v2.guard-policy-v1.SALE` capability if you apply the guard-policy and define a sales guard for the token.

Required capabilities and parameters for the `withdraw` function:

- marmalade-v2.ledger.WITHDRAW
  - id
  - seller
  - amount
  - timeout
  - sale-id

- marmalade-v2.guard-policy-v1.SALE
  - token-id
  - seller
  - amount

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
