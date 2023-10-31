# Supporting Chainweaver Key Derivation

Date: 2023-10-31

Status: Accepted

## Context

We need to support chainweaver users. Discussions have revolved around
supporting keypair import or key derivation from a seed.

## Decision

We have chosen to use the bundle file from the [kadena-io/cardano-crypto][1]
repository. This choice is driven by the following factors:

1. **Custom Algorithm**: The bundle file contains a custom key derivation
   algorithm based on BIP32. that we cant find an alternative library for that.

2. **Lack of Documentation**: The library lacks comprehensive documentation,
   making maintenance and understanding of its design challenging. To mitigate
   potential issues stemming from this lack of documentation, we have opted to
   use the bundle as-is.

3. **Dependency Considerations**: The library relies on a C library through
   WebAssembly (WASM), introducing specific dependencies during the build
   process. To maintain a streamlined monorepo, we have decided against
   including these dependencies.

## Consequences

This decision has the following implications:

- The bundle file must be included in the git repository.
- We may need to find ways to let users use the library for BIP44 without
  requiring its inclusion in output files.

## Resources

[kadena-io/cardano-crypto repository][1]

[1]:
  https://github.com/kadena-io/cardano-crypto.js/tree/jam%40chainweaver-keygen
