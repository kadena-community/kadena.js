---
title: TODO
description: Kadena makes blockchain work for everyone.
menu: TODO
label: TODO
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/kadena.js/README.md
layout: full
tags: [run tests,pact server]
lastModifiedDate: Thu, 06 Jul 2023 12:02:09 GMT
---
# TODO

*   make ready to go public
*   npm registry
*   release cycles

### Function Migration Progress

*   DONE: 16
*   PENDING: 5
*   TODO: 35

[pact-lang-api.js ](https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js):

crypto:

*   **DONE** `binToHex`
*   **DONE** `hexToBin`
*   **DONE** `base64UrlEncode`
*   **DONE** `base64UrlDecode`
*   **DONE** `base64UrlEncodeArr`
*   **DONE** `base64UrlDecodeArr`
*   **DONE** `strToUint8Array`
*   **DONE** `uint8ArrayToStr`
*   **DONE** `hash`
*   **DONE** `hashBin`
*   **DONE** `genKeyPair`
*   **DONE** `restoreKeyPairFromSecretKey`
*   **DONE** `sign`
*   **DONE** `signHash`
*   **DONE** `verifySig`
*   **DONE** `toTweetNaclSecretKey`

api:

*   **PENDING** `createSendRequest`:
    *   Omitted, it just wrapped a list of Commands into the expected format for the
        `/send` endpoint. `ISendRequestBody` type created instead.
*   **DONE** `prepareContCommand`:
    *   Puts together and signs a continuation payload `Command`.
*   **DONE** `prepareExecCommand`:
    *   Puts together and signs an exec payload `Command`.
*   **PENDING** `createCommand`:
    *   Puts together a `Command` type from a list of signatures and a stringified
        payload. Also checks that the signatures are for correct hash.
    *   Pending for renaming, formally mkSingleCmd.
*   **DONE** `createContCommand`:
    *   A wrapper for a `mkPublicSend` and `prepareContCmd` call. Could potentially
        be omitted.
*   **DONE** `createExecCommand`:
    *   A wrapper for a `mkPublicSend` and `prepareExecCmd` call. Could potentially
        be omitted.
*   **PENDING** `createLocalCommand`:
    *   Wrapper for `prepareExecCmd`. The request type for `local` endpoint is just
        a single `Command`. Could be omitted, but the naming here does provides
        extra clarity.
*   **DONE** `createPollRequest`:
    *   Prepares a `/poll` endpoint request type (i.e. a list of request keys) from
        a `{cmds: [Command]}` type (i.e. the type of the `/send` endpoint). Ignore
        naming/docs that imply the `Command` should have an exec payload.
*   **DONE** `createListenRequest`:
    *   Prepares a `/listen` endpoint request type. Similar to `createPollRequest`,
        but only uses the first request key.
*   **DONE** `attachSignature`:
    *   API Helper function that attaches signed or unsigned signature from a
        keypair and stringified payload.
*   **DONE** `pullAndCheckHashs`:
    *   API Helper function maps through signatures and make sure that the
        signatures are signing the same hash and pulls the hash.
*   **DONE** `pullSignature`:
    *   API Helper function that pulls signature only object from signature with
        hash object `{hash, pubKey, sig}`
*   **DONE** `pullSigner`:
    *   API Helper function that pulls public key and capability list if it exists.

lang:

*   **PENDING** `mkExp`
*   **PENDING** `mkMeta`
*   **PENDING** `mkCap`:
    *   Returns a `SigningCap`, which contains a regular Pact capability and some
        added fields consumed by chainweaver.

fetch:

*   **PENDING** `send`
*   **TODO** `local`
*   **TODO** `poll`
*   **TODO** `listen`
*   **TODO** `spv`

wallet:

*   **TODO** `sign`:
    *   Sends an enriched `Command` payload to the signing API of the Chainweaver
        wallet.
*   **TODO** `sendSigned`:
    *   Very similar to `fetch.send` function, but expects a single `Command`
        instead of a list of them. Could be omitted.
*   **DONE** `createCap`
    *   Returns a `SigningCap`, which contains a regular Pact capability and some
        added fields consumed by chainweaver.

[chainweb.js ](https://github.com/kadena-io/chainweb.js/blob/main/src/chainweb.js):

cut:

*   **TODO** `current`:
    *   Queries a chainweb node's `/cut` endpoint. Uses retry.

event:

*   **TODO** `range`:
    *   Calls the `blocks` function, which eventually calls `branchPage` function.
*   **TODO** `recent`:
    *   Similar to `event.range`, but calls `recentBlocks` instead.
*   **TODO** `stream`
*   **TODO** `height`:
    *   Similar to `range` but filters for a specific block height.
*   **TODO** blockHash:
    *   Queries `blockByBlockHash` and filters for the events produced by that
        block.

[marmalade.js ](https://github.com/kadena-io/marmalade/blob/main/src/Pact.SigBuilder.js):

SigData:

*   **DONE** `mkCap`:

    *   Similar to pact-lang's `mkCap` function, but this one creates a regular Pact
        capability.

*   **TODO** `mkMeta`:

    *   Identical to pact-lang's `mkMeta`. Can be omitted.

*   **TODO** `mkSignerCList`:

    *   Returns the capability and signer's public key in the format expected in the
        `signers` field of `SigBuilder`.

*   **TODO** `mkSignerGas`:

    *   Calls `mkSignerCList` with gas capability.

*   **TODO** `mkSignerUnrestricted`:

    *   Similar to `mkSignerCList` but without caps (hence an unrestricted signer).

*   **TODO** `mkExecPayload`:

    *   Prepares an exec payload for the `cmd` field of the `SigData` type.

*   **TODO** `mkContPayload`:

    *   Prepares a continuation payload for the `cmd` field of the `SigData` type.

*   **TODO** `mkSigData`

*   util:

    *   **TODO** `gasCap`: Gas capability.
    *   **TODO** `addGasCap`:
        *   Adds a gas capbility to a list of capabilities. Uses `gasCap`.
    *   **TODO** `mergeSigners`:
        *   Combines multiple signer arrays created by the `mkSigner*` functions. Used
            by `SigBuilder`.
    *   **TODO** `autoCreationTime`:
        *   Gets the system's local time in the format expected by `creation-time`
            fields in transactions.
    *   **TODO** `autoNonce`:
        *   Stringifies the current date as an easy way to set a default nonce.
    *   **TODO** `pubKeysFromSigners`:
        *   Gets public key from signers created by `mkSigner*` functions.

*   ex:

    *   **TODO** `execCmdExample1`:
        *   Creates an example exec transaction that can be sent to the wallet for
            signing. Could be omitted.
    *   **TODO** `contCmdExample1`:
        *   Creates an example continuation transaction that can be sent to the wallet
            for signing. Could be omitted.

*   debug
    *   **DONE** `toggleDebug`: Omitted.

### Enhacements

**(1) Auto detection of network versions**

**Problem:**

(A) When querying a chainweb node, the server expects the endpoint to have a
specific format. For example:

    http://localhost:8080/chainweb/0.0/development/chain/1/pact

In the above, `0.0` represents the node API Version and could change later on.
Also, `development` represents the version of Chainweb that the node is running.
Other possible values are `testnet04` and `mainnet01`. Both of these pieces of
information is returned by querying the `/info` endpoint. For example:

    http://localhost:8080/info

(B) The Chainweb node version (i.e. `development`) is a required field in a
transaction's payload. An error is thrown if the network specified in the
transaction payload does not match the network version specified in the endpoint
prefix (i.e. `../0.0/development/chain..`).

It is an error prone user experience to have users pass along a node's version
information along with the hostname, especially if this information is easily
autodected.

**Proposal:**

Doug outlines an approach in [KadenaPorcelain ](https://gist.github.com/mightybyte/ea63f8d7f7f8d362f5dc4612e0d2ad6c#file-kadenaporcelain-hs-L94) where network (i.e.
pact-server, Chainweb mainnet, Chainweb testnet) and other version specific data
(i.e. Chainweb's `0.0` version) is autodetected. This is done by querying the
`/info` endpoint for Chainweb nodes and the `/version` endpoint for pact-server.

This network and version information is then passed to functions that construct
transactions and functions that call the different Pact API endpoints.

[1]: http://localhost:8080

[2]: https://github.com/kadena-io/devnet

[3]: https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js

[4]: https://github.com/kadena-io/chainweb.js/blob/main/src/chainweb.js

[5]: https://github.com/kadena-io/marmalade/blob/main/src/Pact.SigBuilder.js

[6]: https://gist.github.com/mightybyte/ea63f8d7f7f8d362f5dc4612e0d2ad6c#file-kadenaporcelain-hs-L94
