### Reusable code

Meant for providing either dApps or wallets with the functionality required to connect with Kadena.

This is not related to wallet-connect.

It includes registry functionality like:

- Registry lookup methods
- Transfer resolving (calculating coin amounts to transfer per chain)

And remote signing:

- a server instance for wallets
- a client instance for dApps
- allow communication between them using peerjs

The reason we are testing the peerjs methods is to validate our ideas about how
dApp to wallet communication can go, with the registry in mind.

The registry introduces extra complexity which we want to take away by providing the library with all that logic.

TODO: figure out how the extension can be a "offline" bridge between the wallet and dApp by providing data on the `window`
Using only peerjs means you will need to have your wallet open to be able to query for example your accounts.
If the extension provides this without a direct peerjs connection, it gives the dApp more information and we can save the real connection until something needs to be signed.

This could be done by having the extension connect to the wallet and query and cache data when both are active.
