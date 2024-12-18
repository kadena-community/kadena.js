import type { SpireKeyRequest } from './spirekey.service.js';

export const getHtml = (data: SpireKeyRequest) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>KadenaCLI SpireKey</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="importmap">
    {
      "imports": {
        "@kadena/spirekey-sdk": "https://ga.jspm.io/npm:@kadena/spirekey-sdk@1.0.0/dist/index.mjs"
      },
      "scopes": {
        "https://ga.jspm.io/": {
          "@emotion/hash": "https://ga.jspm.io/npm:@emotion/hash@0.9.2/dist/emotion-hash.esm.js",
          "@kadena/chainweb-node-client": "https://ga.jspm.io/npm:@kadena/chainweb-node-client@0.8.0/lib/index.js",
          "@kadena/client": "https://ga.jspm.io/npm:@kadena/client@1.16.0/lib/index.js",
          "@kadena/cryptography-utils": "https://ga.jspm.io/npm:@kadena/cryptography-utils@0.4.4/lib/index.js",
          "@kadena/pactjs": "https://ga.jspm.io/npm:@kadena/pactjs@0.4.3/lib/index.js",
          "@vanilla-extract/css": "https://ga.jspm.io/npm:@vanilla-extract/css@1.16.1/dist/vanilla-extract-css.browser.esm.js",
          "@vanilla-extract/css/fileScope": "https://ga.jspm.io/npm:@vanilla-extract/css@1.16.1/fileScope/dist/vanilla-extract-css-fileScope.browser.esm.js",
          "@vanilla-extract/private": "https://ga.jspm.io/npm:@vanilla-extract/private@1.0.6/dist/vanilla-extract-private.esm.js",
          "base64-js": "https://ga.jspm.io/npm:base64-js@1.5.1/index.js",
          "bignumber.js": "https://ga.jspm.io/npm:bignumber.js@9.1.2/bignumber.js",
          "blakejs": "https://ga.jspm.io/npm:blakejs@1.2.1/index.js",
          "buffer": "https://ga.jspm.io/npm:buffer@6.0.3/index.js",
          "cross-fetch": "https://ga.jspm.io/npm:cross-fetch@3.1.8/dist/browser-ponyfill.js",
          "crypto": "https://ga.jspm.io/npm:@jspm/core@2.1.0/nodelibs/browser/crypto.js",
          "css-what": "https://ga.jspm.io/npm:css-what@6.1.0/lib/es/index.js",
          "cssesc": "https://ga.jspm.io/npm:cssesc@3.0.0/cssesc.js",
          "debug": "https://ga.jspm.io/npm:debug@4.3.4/src/browser.js",
          "dedent": "https://ga.jspm.io/npm:dedent@1.5.3/dist/dedent.mjs",
          "deep-object-diff": "https://ga.jspm.io/npm:deep-object-diff@1.1.9/mjs/index.js",
          "deepmerge": "https://ga.jspm.io/npm:deepmerge@4.3.1/dist/cjs.js",
          "ieee754": "https://ga.jspm.io/npm:ieee754@1.2.1/index.js",
          "lru-cache": "https://ga.jspm.io/npm:lru-cache@10.4.3/dist/esm/index.js",
          "media-query-parser": "https://ga.jspm.io/npm:media-query-parser@2.0.2/dist/media-query-parser.esm.js",
          "modern-ahocorasick": "https://ga.jspm.io/npm:modern-ahocorasick@1.1.0/dist/index.js",
          "ms": "https://ga.jspm.io/npm:ms@2.1.2/index.js",
          "picocolors": "https://ga.jspm.io/npm:picocolors@1.1.1/picocolors.browser.js",
          "process": "https://ga.jspm.io/npm:@jspm/core@2.1.0/nodelibs/browser/process.js",
          "tweetnacl": "https://ga.jspm.io/npm:tweetnacl@1.0.3/nacl-fast.js"
        }
      }
    }
    </script>
    <script>
      window.process = {env: {}};
    </script>
    <script async src="https://ga.jspm.io/npm:es-module-shims@1.10.1/dist/es-module-shims.js" crossorigin="anonymous"></script>
    <script type="module">
      import { connect, sign } from "@kadena/spirekey-sdk";
      async function selectAccount(){
        try {
          document.getElementById('status').innerHTML = 'Waiting for account selection...';
          const account = await connect('${data.networkId}', '${data.chainId}');
          document.getElementById('status').innerHTML = 'Account selected';
          await fetch('/account', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(account)
          });
        } catch (error) {
          console.warn('User canceled signin', error);
          document.getElementById('status').innerHTML = 'Cancelled.';
        }
      }
      async function signTransactions(){
        try {
          document.getElementById('status').innerHTML = 'Signing...';
          const { transactions } = await sign(${JSON.stringify(data.transactions)});
          console.log('transactions:', transactions);
          await fetch('/transactions', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(transactions)
          });
        } catch (error) {
          console.warn('User canceled signin', error);
          document.getElementById('status').innerHTML = 'Cancelled.';
        }
      }
      document.getElementById('selectAccount').addEventListener('click', selectAccount);
      document.getElementById('signTransactions').addEventListener('click', signTransactions);
    </script>
  </head>
  <body>
    <h1>KadenaCLI SpireKey</h1>
    <button id="selectAccount">Select account</button>
    <button id="signTransactions">Sign</button>
    <div id="status"></div>
    <div id="account"></div>
  </body>
</html>`;
