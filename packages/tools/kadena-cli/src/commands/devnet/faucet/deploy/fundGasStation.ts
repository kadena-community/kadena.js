import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer } from '@kadena/client-utils/coin';
import {
  DOMAIN,
  GAS_STATION,
  InitialFunding,
  NETWORK_ID,
  SENDER_00,
} from './constants.js';

export const fundGasStation = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainId;
  upgrade: boolean;
}): Promise<string | undefined> => {
  if (NETWORK_ID !== 'development') {
    return 'Only needs to happen on Devnet (development), funding happens differently on other networks.';
  }

  if (upgrade) {
    return 'The step "fundGasStation" is skipped for upgrades';
  }

  const result = await transfer(
    {
      sender: {
        account: SENDER_00.accountName,
        publicKeys: [SENDER_00.publicKey],
      },
      receiver: GAS_STATION,
      amount: `${InitialFunding}`,
      gasPayer: {
        account: SENDER_00.accountName,
        publicKeys: [SENDER_00.publicKey],
      },
      chainId,
    },
    {
      host: ({ networkId, chainId }) =>
        `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      defaults: { networkId: NETWORK_ID },
      sign: createSignWithKeypair([
        {
          publicKey: SENDER_00.publicKey,
          secretKey: SENDER_00.secretKey,
        },
      ]),
    },
  ).execute();

  return result;
};
