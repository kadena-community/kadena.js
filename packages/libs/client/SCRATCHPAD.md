- [call signature][1]
- [Typescript generated dts templates][2]

# Call interface

```ts
import { Pact } from './pact';
import { IFunctionResponse } from './pact-typing';

const builder: IFunctionResponse = Pact.modules.coin.transfer(
  'k:20394',
  '',
  1203,
);

Pact.modules.coin['TRANSFER-mgr'](1203, 1203).generate();
Pact.templates['@kadena/tx-library'].template('safe-ref-rotate').args({
  'to-acct': 'k:20394',
  'from-acct': 'k:20394',
  amount: 1203,
  chain: 1,
  network: 'testnet',
  'from-key': 'k:20394',
});

// executing 'call' does a fetch
builder
  .call()
  .then(async (res) => {
    console.log('res', await res.text());
    console.log('success');
  })
  .catch((error) => {
    console.error(error);
  });

// executing 'generate' creates the expression
const exp: string = builder.generate();
console.log({ exp });

// ======== executing something that's not defined in the types
const hello: boolean = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expression: any = (Pact as any).anything.you.like.to
  .call('something arg', hello)
  .generate();

console.log({ expression });
```

# Templates interface

```ts
// To be generated
export interface IPact {
  modules: IPactModules;
  templates: TemplateCollection;
}

type Template<TArgs> = {
  args(args: TArgs): void;
};

type FancyNumber = number;

type TemplateArgs = {
  'simple-transfer': {
    'from-acct': string;
    'to-acct': string;
    amount: FancyNumber;
    chain: number;
    network: 'testnet' | 'mainnet';
    'from-key': string;
  };
};

type TemplateCollection = {
  template(
    tplName: 'simple-transfer' | 'safe-transfer' | 'safe-ref-rotate',
  ): Template<TemplateArgs['simple-transfer']>;
};

type GeneratedTypePact = {
  templates(
    repo: 'kadena-io/tx-library' | 'my-repo/my-templates',
  ): TemplateCollection;
  modules: {};
};

const Pactjs: GeneratedTypePact = {} as GeneratedTypePact;

// pactjs-cli generate --template-repo kadena-io/tx-library
Pactjs.templates('kadena-io/tx-library').template('simple-transfer').args({
  'to-acct': 'k:013948193857',
  'from-acct': 'k:013948193857',
  amount: 10,
  chain: 1,
  network: 'testnet',
  'from-key': 'k:013948193857',
});
// pactjs-cli generate --file ./coin.contract.pact
// pactjs-cli generate --module coin --network "mainnet"
// @ts-ignore
Pactjs.modules.coin.transfer().generate();
/**
 * {"cmd":"{\"signers\":[{\"pubKey\":\"554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94\",\"k:32ed2605d925520a8bb1f08a96ce0405179ed8ba5fdd0ae3001951bc6b84fa13\",1]}]}],\"meta\":{\"creationTime\":1659096340,\"ttl\":28800,\"chainId\":\"1\",\"gasPrice\":1.0e-6,\"gasLimit\":600,\"sender\":\"\"},\"nonce\":\"chainweaver\",\"networkId\":\"mainnet01\",\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94\\\" \\\"k:32ed2605d925520a8bb1f08a96ce0405179ed8ba5fdd0ae3001951bc6b84fa13\\\" 1.0)\",\"data\":null}}}","hash":"JnkmNcQGodlE3mFqOLOYAx56riVtNpWNFGWCaxLVbdY","sigs":{"554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94":}}
 */
```

[1]: #call-signature
[2]: #typescript-generated-dts-templates
