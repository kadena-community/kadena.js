# ADR: Supporting Chainweaver Key Derivation (Updated 2024-05-22)

**Date**: 2023-10-31

**Status**: Accepted

## Change Log:

- **2024-05-22**: Separated test config for Chainweaver to avoid long timeout
  for all newly developed functions.

## Context

We need to support Chainweaver users. Discussions have revolved around
supporting keypair import or key derivation from a seed. Some of the Chainweaver
helpers are slow.

## Decision

We have chosen to use the bundle file from the [kadena-io/cardano-crypto][1]
repository. This choice is driven by the following factors:

1. **Custom Algorithm**: The bundle file contains a custom key derivation
   algorithm based on BIP32, which we can't find an alternative library for.
2. **Lack of Documentation**: The library lacks comprehensive documentation,
   making maintenance and understanding of its design challenging. To mitigate
   potential issues stemming from this lack of documentation, we have opted to
   use the bundle as-is.
3. **Dependency Considerations**: The library relies on a C library through
   WebAssembly (WASM), introducing specific dependencies during the build
   process. To maintain a streamlined monorepo, we have decided against
   including these dependencies.
4. **Separated Test Configs**: Since the Chainweaver helpers are slow, we need
   to use a long timeout of `30000` for the tests. However, we need to avoid
   this long timeout for SLIP10 and other newly developed functions. Therefore,
   we separated the test configurations and reduced the timeout to `5000` for
   these specific tests.

## Consequences

This decision has the following implications:

- The bundle file must be included in the Git repository.
- We may need to find ways to let users use the library for BIP44 without
  requiring its inclusion in output files.
- Chainweaver utilities are slow and should be used with caution in a server
  environment to avoid potential DDoS or performance issues.

## Resources

[kadena-io/cardano-crypto repository][1]

[1]:
  https://github.com/kadena-io/cardano-crypto.js/tree/jam%40chainweaver-keygen
