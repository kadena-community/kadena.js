# Integrated dApps

**Date**: 2024-12-06

**Status**: Draft

## Context

People usually write dapps in order to interact with smart contracts. This means
this need ro host this app as well some where

## Decision

It is proposed to implement the encryption of sensitive data within the library,
ensuring a unified approach for consumers. This decision aligns with the
existing practice in the chainweaver API, making both the new and chainweaver
APIs consistent in handling encryption. The library functions will accept a
password as the first argument for consistency. Additionally, the decision
includes exporting the `kadenaDecrypt` function for consumers requiring data
decryption.

## Consequences

The decision to encrypt sensitive data within the library has the following
implications:

- A password becomes mandatory for all operations.
- The application of encryption to keys may introduce some performance overhead,
  which requires monitoring.
- Consumers who prefer to work with unencrypted data will incur the cost of
  encryption and decryption or may choose not to use the library.
