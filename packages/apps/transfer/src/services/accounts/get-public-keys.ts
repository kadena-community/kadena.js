import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { type ChainId } from '@kadena/types';

import { generateApiHost } from '../utils/utils';
const gasLimit: number = 6000;
const gasPrice: number = 0.001;
const ttl: number = 600;
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AccountGuard {
  pred: string;
  keys: string[];
}
export const getPublicKeys = async (
  networkId: ChainwebNetworkId,
  chainId: string,
  accountName: string,
): Promise<AccountGuard | undefined> => {
  const arrPromises = [];

  const pactCommand = new PactCommand();

  pactCommand.code = createExp(`coin.details "${accountName}"`);
  try {
    const API_HOST = generateApiHost(networkId, chainId);

    pactCommand.setMeta(
      {
        chainId: chainId as ChainId,
        gasLimit,
        gasPrice,
        ttl,
      },
      networkId,
    );

    const data = await pactCommand.local(API_HOST, {
      signatureVerification: false,
      preflight: false,
    });

    return data.result.data.guard;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
