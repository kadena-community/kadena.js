---
title: Create custom policies
description: Describes how to import and work with token policy interfaces to create custom token policies.
menu: Policies
label: Create custom policies
order: 2
layout: full
---

# Create custom policies

In additions to the concrete and example policies, you can use the interfaces defined in the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v2.pact) standard to create custom policies.

Custom policies allow you to implement rules and checks that are tailored to your specific requirements. 
To implement a custom policy, you first need to import the functions and interfaces defined in `token-policy-v2`.

## Basic steps

To create a custom policy:

1. Create a `.pact` file to contain the policy.
   For example, create a file called `my-custom.pact`.

2. Import the `token-policy-v2` interfaces by adding lines similar to the following to the file:

   ```pact
   (namespace 'my-namespace)
   (import 'marmalade-v2.token-policy-v2)
   ```

3. Use the following functions to define when policies are enforced:
   
   - `enforce-mint`: Governs token minting. 
   - `enforce-burn`: Regulates token burning.
   - `enforce-init`: Handles token initialization. 
   - `enforce-offer`: Manages token offering for sale. 
   - `enforce-buy`: Controls purchasing of tokens offered for sale. 
   - `enforce-withdraw`: Defines the withdraw policy.
   - `enforce-transfer`: Administers token transfers between accounts.

1. Create a `.repl` file to test different conditions for the policy.

## Policy enforcement functions

   You can define custom logic for each policy enforcement function to address unique requirements for your tokens. 
   By implementing custom checks within the functions, you can control what happens during each phase of token activity.

### enforce-mint

Use `enforce-mint` to enforce the minting policy for the specified _token_ to the specified _account_ with the specified mint _amount_.

#### Parameters

```pact
    ( token:object{token-info}
      account:string
      guard:guard
      amount:decimal
    )
```

#### Return value

Boolean

### enforce-burn

Use `enforce-burn` to enforce the burn policy for the specified _token_ from the specified _account_ with the specified burn _amount_.

#### Parameters

```pact
    ( token:object{token-info}
      account:string
      amount:decimal
    )
```
#### Return value

Boolean

### enforce-init

Use `enforce-init` to enforce the logic for the specified _token_ when token created is initiated.

#### Parameters

```pact
(token:object{token-info})
)
```

#### Return value

Boolean

### enforce-offer

Use `enforce-offer` to enforce the offer policy for the specified _token_ offered by the specified _seller_ in the specified _amount_ with the specified _sale-id_.

#### Parameters

```pact
( token:object{token-info}
      seller:string
      amount:decimal
      timeout:integer
      sale-id:string )
)
```

#### Return value

Boolean

### enforce-buy

Use `enforce-buy` to enforce the buy policy for the specified _token_ offered by the specified _seller_ in the specified _amount_ with the specified _sale-id_.

### Parameters

```pact
    ( token:object{token-info}
      seller:string
      buyer:string
      buyer-guard:guard
      amount:decimal
      sale-id:string )
  )
```

#### Return value

Boolean

### enforce-withdraw

Use `enforce-withdraw` to enforce the withdrawal policy for the specified _token_ offered by the specified _seller_ in the specified _amount_ with the specified _sale-id_.

    ( token:object{token-info}
      seller:string
      amount:decimal
      timeout:integer
      sale-id:string )
  )

#### Return value

Boolean

### enforce-transfer

Use `enforce-transfer` to enforce the transfer policy for the specified _token_ in the specified _amount_ from the specified _sender_ to the specified _receiver_.
This function also governs rotation of the sender with same _receiver_ and an _amount_ of 0.0.

#### Parameters

```pact
    ( token:object{token-info}
      sender:string
      guard:guard
      receiver:string
      amount:decimal )
    @doc " 
  )
```

#### Return value

Boolean