import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { type ChainId } from '@kadena/types';

import { generateApiHost } from '../utils/utils';

const gasLimit: number = 6000;
const gasPrice: number = 0.001;
const ttl: number = 600;

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ChainResult {
  chain: number;
  data?: {
    balance: string;
    guard: { pred: string; keys: string[] };
    account: string;
  };
}

export const getPublicKey = async (
  networkId: ChainwebNetworkId,
  chainId: string,
  accountName: string,
): Promise<any> => {
  const arrPromises = [];
  // 1 - Create a new PactCommand
  const pactCommand = new PactCommand();

  // 2 - Bind to the Pact code
  pactCommand.code = createExp(`coin.details "${accountName}"`);

  try {
    const API_HOST = generateApiHost(networkId, chainId);
    // 3 - Set the meta data
    pactCommand.setMeta(
      {
        chainId: chainId as ChainId,
        gasLimit,
        gasPrice,
        ttl,
      },
      networkId,
    );
    // 4 - Call the Pact local endpoint to retrieve the result
    const data = await pactCommand.local(API_HOST, {
      signatureVerification: false,
      preflight: false,
    });
    console.log(data, ' DATA IN GET PUBLIC KEYS');
    const key = data.result.data.guard.keys[0];

    return key;
  } catch (error) {
    console.log(error);
    return [];
  }
};
