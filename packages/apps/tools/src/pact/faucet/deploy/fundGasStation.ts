import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer } from '@kadena/client-utils/coin';
import {
  COIN_ACCOUNT,
  DOMAIN,
  GAS_PROVIDER,
  GAS_STATION,
  NETWORK_ID,
} from './constants';

export const fundGasStation = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}) => {
  if (upgrade) {
    return 'The step "fundGasStation" is skipped for upgrades';
  }

  const result = await transfer(
    {
      sender: {
        account: COIN_ACCOUNT,
        publicKeys: [GAS_PROVIDER.publicKey],
      },
      receiver: GAS_STATION,
      amount: '1',
      gasPayer: {
        account: GAS_PROVIDER.accountName,
        publicKeys: [GAS_PROVIDER.publicKey],
      },
      chainId,
    },
    {
      host: ({ networkId, chainId }) =>
        `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      defaults: { networkId: NETWORK_ID },
      sign: createSignWithKeypair([
        {
          publicKey: GAS_PROVIDER.publicKey,
          secretKey: GAS_PROVIDER.privateKey,
        },
      ]),
    },
  )
    .on('sign', (data) => console.log(data))
    .on('preflight', (data) => console.log(data))
    .on('submit', (data) => console.log(data))
    .on('listen', (data) => console.log(data))
    .execute();

  console.log(result);
  return;
};
