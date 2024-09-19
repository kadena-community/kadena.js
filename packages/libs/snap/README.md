# Kadena Snap

This is Kadena Snap, which is written in TypeScript. It leverages the state storage of Snaps to store the status of the DApp.
It provides various functions, including `kda_signTransaction`, `kda_addAccount`, `kda_getActiveAccount`, and many more.

## Testing

The Kadena Snap project includes several tests that cover the majority of its functions. To test the snap, navigate to this directory and run yarn test. This command will use [`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest) to execute the tests found in src/index.test.ts.
