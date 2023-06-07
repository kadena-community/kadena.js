import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { type ChainId } from '@kadena/types';

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

  const pactCommand = new PactCommand();

  pactCommand.code = createExp(`${token}.details "${accountName}"`);

  try {
    for (let i = 0; i < 20; i++) {
      const NETWORK_ID = server.includes('testnet') ? 'testnet04' : 'mainnet01';
      const API_HOST = `https://${server}/chainweb/0.0/${NETWORK_ID}/chain/${i}/pact`;

      pactCommand.setMeta(
        {
          chainId: i.toString() as ChainId,
          gasLimit,
          gasPrice,
          ttl,
        },
        NETWORK_ID,
      );

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
