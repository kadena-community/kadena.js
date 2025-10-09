# @kadena/wallet-adapter-metamask-snap

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

## 0.1.3

### Patch Changes

- @kadena/client\@1.18.2
- @kadena/wallet-adapter-core\@0.1.2

## 0.1.2

### Patch Changes

- 24ed24c: Added constant export for adapter name matching
  - @kadena/client\@1.18.1
  - @kadena/wallet-adapter-core\@0.1.1

## 0.1.1

### Patch Changes

- 4945ee1: Add repository field to package.json

## 0.1.0

### Minor Changes

- d45d854: Add Snap adapter with connect, getAccount_v1, getAccounts_v2,
  getNetwork_v1, getNetworks_v1, quicksign_v1, changeNetwork_v1, checkStatus;
  add changeNetwork_v1 to BaseAdapter; update React example for BaseAdapter
  v0.0.2

### Patch Changes

- Updated dependencies \[d45d854]
  - @kadena/wallet-adapter-core\@0.1.0
