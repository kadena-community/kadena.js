import type {
  CommandPayloadStringifiedJSON,
  EnvData,
  ICommand,
  ICommandPayload,
  IKeyPair,
  IMetaData,
  NetworkId,
  Nonce,
  PactTransactionHash,
  Proof,
  Rollback,
  SignatureWithHash,
  Step,
} from '@kadena/types';

export const keyPair: IKeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};
export const keyPairs: Array<IKeyPair> = [keyPair];
export const nonce: Nonce = 'step01';
export const pactId: PactTransactionHash =
  'TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY';
export const step: Step = 1;
export const rollback: Rollback = false;
export const envData: EnvData = {};
export const proof: Proof = undefined;
export const networkId: NetworkId = undefined;

export const meta: IMetaData = {
  creationTime: 0,
  ttl: 0,
  gasLimit: 0,
  chainId: '0',
  gasPrice: 0,
  sender: '',
};

export const payload: ICommandPayload = {
  networkId: networkId !== undefined ? networkId : null,
  payload: {
    cont: {
      pactId: pactId,
      step: step,
      rollback: rollback,
      data: {},
      proof: proof !== undefined ? proof : null,
    },
  },
  signers: [
    {
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ],
  meta: {
    creationTime: 0,
    ttl: 0,
    gasLimit: 0,
    chainId: '0',
    gasPrice: 0,
    sender: '',
  },
  nonce: JSON.stringify(nonce),
};

export const signature: SignatureWithHash = {
  hash: 'XJ_R9bw2-7kPmW6565rF6gZ02sqbtC99Jjyrb3L8bq0',
  pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  sig: '4ac912a5fb23cbfe55145b1d630cc9db671dc087b48c107d3f19419c792a6020fed6c851770b2d16728bebb6762458b97ceee691023d19e7a9d875d95f3afe08',
};

export const stringifiedPayload: CommandPayloadStringifiedJSON =
  '{"networkId":null,"payload":{"cont":{"proof":null,"pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":{}}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}';

export const command: ICommand = {
  hash: 'XJ_R9bw2-7kPmW6565rF6gZ02sqbtC99Jjyrb3L8bq0',
  sigs: [
    {
      sig: '4ac912a5fb23cbfe55145b1d630cc9db671dc087b48c107d3f19419c792a6020fed6c851770b2d16728bebb6762458b97ceee691023d19e7a9d875d95f3afe08',
    },
  ],
  cmd: '{"networkId":null,"payload":{"cont":{"proof":null,"pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":{}}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};
