---
'@kadena/wallet-adapter-metamask-snap': minor
'@kadena/wallet-adapter-walletconnect': minor
---

WalletConnect Adapter

- Persist active session topic in localStorage and restore on reload
- Reuse existing pairings to avoid extra QR modal scans
- Reconnect automatically if provider is still connected
- Cleanup provider state and stored session on disconnect/deletion

Snap Adapter

- Detection is now non-invasive: `detectSnapProvider` no longer performs
  `wallet_getSnaps` or any RPC that could trigger a MetaMask unlock prompt. All
  snap installation/enablement and potential prompts are deferred to the adapter
  `connect()` flow.
