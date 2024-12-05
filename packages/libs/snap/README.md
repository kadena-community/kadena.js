# Kadena Snap

This is Kadena Snap, which is written in TypeScript. It leverages the state
storage of Snaps to store the status of the DApp. It provides various functions,
including `kda_signTransaction`, `kda_addAccount`, `kda_getActiveAccount`, and
many more.

<!-- markdownlint-disable MD033 -->
<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>
<!-- markdownlint-enable MD033 -->

## Testing

The Kadena Snap project includes several tests that cover the majority of its
functions. To test the snap, navigate to this directory and run yarn test. This
command will use
[`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest)
to execute the tests found in src/index.test.ts.
