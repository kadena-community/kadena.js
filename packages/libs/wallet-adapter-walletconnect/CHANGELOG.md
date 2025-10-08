# @kadena/wallet-adapter-walletconnect

## 0.2.0

### Minor Changes

- f00545d: WalletConnect Adapter

  - Persist active session topic in localStorage and restore on reload
  - Reuse existing pairings to avoid extra QR modal scans
  - Reconnect automatically if provider is still connected
  - Cleanup provider state and stored session on disconnect/deletion

  Snap Adapter

  - Detection is now non-invasive: `detectSnapProvider` no longer performs
    `wallet_getSnaps` or any RPC that could trigger a MetaMask unlock prompt.
    All snap installation/enablement and potential prompts are deferred to the
    adapter `connect()` flow.

### Patch Changes

- @kadena/client\@1.18.3
- @kadena/wallet-adapter-core\@0.1.3

## 0.1.2

### Patch Changes

- @kadena/client\@1.18.2
- @kadena/wallet-adapter-core\@0.1.2

## 0.1.1

### Patch Changes

- 24ed24c: Added constant export for adapter name matching
  - @kadena/client\@1.18.1
  - @kadena/wallet-adapter-core\@0.1.1

## 0.1.0

### Minor Changes

- 4b90675: walletconnect-adapter: Include chains argument in modal instantiation

## 0.0.3

### Patch Changes

- Updated dependencies \[d45d854]
  - @kadena/wallet-adapter-core\@0.1.0

## 0.0.2

### Patch Changes

- 15f1d93: Added repository field to package json
- Updated dependencies \[15f1d93]
  - @kadena/wallet-adapter-core\@0.0.2

## 0.0.1

### Patch Changes

- Updated dependencies \[b849855]
- Updated dependencies \[7be1f04]
  - @kadena/client\@1.18.0
  - @kadena/wallet-adapter-core\@0.0.1
