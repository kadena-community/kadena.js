import {
  ChainwebNetworkId,
  ChainwebNonce,
  KeyPair,
  ChainwebContStep,
  ChainwebContRollback,
  ChainwebEnvData,
  ChainwebMetaData,
  Base64Url,
  Base16String,
} from '../../../util';

export const keyPair: KeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};

export const nonce: ChainwebNonce = 'step01';
export const pactId: Base16String =
  'TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY';
export const step: ChainwebContStep = 1;
export const rollback: ChainwebContRollback = false;
export const envData: ChainwebEnvData = {};
export const meta: ChainwebMetaData = {
  creationTime: 0,
  ttl: 0,
  gasLimit: 0,
  chainId: '',
  gasPrice: 0,
  sender: '',
};

export const networkId: ChainwebNetworkId = null;
