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

export const checkBalance = async (
  server: string,
  token: string,
  accountName: string,
): Promise<ChainResult[]> => {
  const arrPromises = [];
  // 1 - Create a new PactCommand
  const pactCommand = new PactCommand();

  // 2 - Bind to the Pact code
  pactCommand.code = createExp(`${token}.details "${accountName}"`);

  try {
    for (let i = 0; i < 20; i++) {
      const NETWORK_ID = server.includes('testnet') ? 'testnet04' : 'mainnet01';
      const API_HOST = `https://${server}/chainweb/0.0/${NETWORK_ID}/chain/${i}/pact`;
      // 3 - Set the meta data
      pactCommand.setMeta(
        {
          chainId: i.toString() as ChainId,
          gasLimit,
          gasPrice,
          ttl,
        },
        NETWORK_ID,
      );
      // 4 - Call the Pact local endpoint to retrieve the result
      const data = pactCommand.local(API_HOST, {
        signatureVerification: false,
        preflight: false,
      });

      arrPromises.push(data);
    }
    const responseArray = await Promise.all(arrPromises);

    return responseArray.map((item, index) => ({
      chain: index,
      data: item.result.data,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getPublicKey = async (
  server: string,
  accountName: string,
  chainId: string,
): Promise<any> => {
  const arrPromises = [];
  // 1 - Create a new PactCommand
  const pactCommand = new PactCommand();

  // 2 - Bind to the Pact code
  pactCommand.code = createExp(`coin.details "${accountName}"`);

  try {
    const NETWORK_ID = server.includes('testnet') ? 'testnet04' : 'mainnet01';
    const API_HOST = generateApiHost(NETWORK_ID, chainId);

    // 3 - Set the meta data
    pactCommand.setMeta(
      {
        chainId: chainId as ChainId,
        gasLimit,
        gasPrice,
        ttl,
      },
      NETWORK_ID,
    );
    // 4 - Call the Pact local endpoint to retrieve the result
    const data = await pactCommand.local(API_HOST, {
      signatureVerification: false,
      preflight: false,
    });
    console.log(data, ' DATA IN GET PUBLIC KEYS');

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
