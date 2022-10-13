# MVP easy way

1. project
2. npm i @kadena/pactjs @kadena/pactjs-cli
3. copy-paste contract to `coin.contract.pact`
4. npx pactjs generate --file "./coin.contract.pact"

# Transaction modules

```ts
// interface for PactModules
declare module '@kadena/pactjs' {
  export type Result = {
    addCap(capName: 'coin.GAS', capArgs: {}): IFunctionResponse<string>;
    addCap(
      capName: 'coin.TRANSFER',
      capArgs: { from: string; to: string; amount: number },
    ): IFunctionResponse<string>;
    addCap(capName: 'coin.GOVERNANCE', capArgs: {}): IFunctionResponse<string>;
  };
  export interface IPactModules {
    coin: {
      transfer: (sender: string, receiver: string, amount: number) => Result;
    };
  }
}
```

```ts
import { Pactjs, sign, send } from '@kadena/client'; // typings available

const transaction = Pactjs.modules.coin
  .transfer('albert', 'randy', 10)
  .addData()
  .addMetaData({ chainId, sender, gasLimit, gasPrice, ttl })
  .addCap('coin.GAS', {}, signer)
  .addCap('coin.TRANSFER', { from: '', to: '', amount: '' }, signer)
  .createTransaction(); // validates at least caps `coin.GAS`

const signedTransaction = sign(transaction);

send(signedTransaction);
```

# Transaction template

// npx pactjs generate --repository git@github.com:kadena-io/tx-library.git //
npx pactjs generate --repository ../myrepo

```ts
// interface for templates
declare module '@kadena/pactjs' {
  export interface ITemplates {
    'github.com:kadena-io': {
      'simple-transfer': (args: {
        'from-acct': string;
        'to-acct': string;
        amount: string;
        chain: string;
        network: string;
        'from-key': string;
      }) => IFunctionResponse<number>;
    };
  }
}
```

```ts
const transaction = Pact.templates['github.com:kadena-io']
  ['simple-transfer']({
    'from-acct': 'k:from-acc',
    'to-acct': 'k:to-acc',
    amount: 100,
    chain: '11',
    network: 'mainnet',
    'from-key': 'k:from-key',
  })
  .createTransaction();

const signFn = process.env === 'development' ? signForTestnet : sign;
const signedTransaction = signFn(transaction);

const sendFn = process.env === 'development' ? sendTestnet : send;
sendFn(signedTransaction);
```

```yaml
code: |-
  (coin.transfer "{{{from-acct}}}" "{{{to-acct}}}" {{amount}})
data:
publicMeta:
  chainId: '{{chain}}'
  sender: { { { from-acct } } }
  gasLimit: 600
  gasPrice: 0.00000001
  ttl: 7200
networkId: { { network } }
signers:
  - public: { { from-key } }
    caps:
      - name: 'coin.TRANSFER'
        args: [{ { { from-acct } } }, { { { to-acct } } }, { { amount } }]
  - public: { { to-key } }
    caps:
      - name: 'coin.GAS'
        args: []
type: exec
```
