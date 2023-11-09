# Encrypting Sensitive Data in Library

**Date**: 2023-11-08

**Status**: Proposal

## Context

Generated seed and private are sensitive dat and should be encrypted to enhance
security. The responsibility for managing this encryption can either lie with
the consumer of the library or be implemented within the library itself.

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
