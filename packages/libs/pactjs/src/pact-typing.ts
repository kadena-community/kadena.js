import type { Response } from 'node-fetch';

export type PactExpression = string;

export interface IFunctionResponse {
  generate: () => PactExpression;
  call: () => Promise<Response>;
}

// To be generated
export interface IPact {
  coin: {
    // (coin.TRANSFER "k:013948193857" 10)
    TRANSFER: (accountKey: string, amount: number) => IFunctionResponse;
  };
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
}

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
Pactjs.modules.coin.transfer().generate()
/**
 * {"cmd":"{\"signers\":[{\"pubKey\":\"554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94\",\"k:32ed2605d925520a8bb1f08a96ce0405179ed8ba5fdd0ae3001951bc6b84fa13\",1]}]}],\"meta\":{\"creationTime\":1659096340,\"ttl\":28800,\"chainId\":\"1\",\"gasPrice\":1.0e-6,\"gasLimit\":600,\"sender\":\"\"},\"nonce\":\"chainweaver\",\"networkId\":\"mainnet01\",\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94\\\" \\\"k:32ed2605d925520a8bb1f08a96ce0405179ed8ba5fdd0ae3001951bc6b84fa13\\\" 1.0)\",\"data\":null}}}","hash":"JnkmNcQGodlE3mFqOLOYAx56riVtNpWNFGWCaxLVbdY","sigs":{"554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94":}}
 */
