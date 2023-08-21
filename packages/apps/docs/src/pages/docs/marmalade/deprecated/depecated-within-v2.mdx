---
title: Deprecated in v2
description: What has been deprecated
menu: Deprecated in v2
label: Deprecated in v2
order: 1
layout: full
---

# Deprecated in v2

## On-chain manifest (v1) to Off-chain URI (v2)

- **What it did**: The on-chain manifest in v1 was responsible for storing
  metadata associated with tokens directly on the blockchain.
- **Why deprecated**: Storing metadata on-chain resulted in certain limitations
  related to scalability and flexibility of data structures.
- **Alternatives**: In v2, we have transitioned to off-chain URIs, primarily
  recommending usage of the InterPlanetary File System (IPFS) for hosting
  metadata. This shift enhances scalability and offers flexibility in data
  storage while aligning with a more decentralised approach.

**v1:**

```pact
    (defschema token-schema manifest:object{manifest} )
```

**v2:**

```pact
    (defschema token-schema
      uri:string
    )
```

## Single Policy Implementation (v1) to Multiple Policy Implementation (v2)

- **What it did**: In v1, only a single policy could be implemented during the
  token creation process.
- **Why deprecated**: This limited the scope of potential applications as each
  token was constrained to one specific policy.
- **Alternatives**: Marmalade v2 supports the inclusion of multiple policies.
  This flexibility widens the range of possible use-cases for each token,
  allowing them to be tailored more closely to the unique requirements of
  various projects.

  **v1: Policy expected a single module:**

```pact
      (defschema token-schema
      	id:string
      	manifest:object{manifest}
      	precision:integer
      	supply:decimal
      	policy:module{kip.token-policy-v1}
      )
```

**v2: Policy is replaced with policies supporting a list of policies conforming
kip.token-policy-v2:**

```pact
	  (defschema token-schema
	    id:string
	    uri:string
	    precision:integer
	    supply:decimal
	    policies:[module{kip.token-policy-v2}]
	  )
```

## Direct Enforcement (v1) to Policy Manager (v2)

- **What it did**: v1 required invoking `enforce-**` functions directly from the
  policy during the policy enforcement process.

- **Why deprecated**: This approach could lead to scattered policy enforcement
  management, making the process potentially less orderly and efficient.

- **Alternatives**: In v2, enforcement functions are invoked from a centralized
  `policy-manager`. This streamlined approach facilitates more efficient policy
  management and enforcement.

  **v1:**

  ```pact
  (policy::enforce-init)
  ```

  **v2:**

  ```pact
  (marmalade.policy-manager.enforce-init)
  ```
