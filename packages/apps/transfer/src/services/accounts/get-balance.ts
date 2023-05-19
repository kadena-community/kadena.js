import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { type ChainId } from '@kadena/types';

const gasLimit = 6000;
const gasPrice = 0.001;
const ttl = 600;

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

    const result: ChainResult[] = responseArray.map((item, index) => ({
      chain: index,
      data: item.result.data,
    }));

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};
