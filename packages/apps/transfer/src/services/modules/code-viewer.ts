import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

const NETWORK_ID: any = 'mainnet01';
const chainId: ChainId = '1';
const gasLimit: number = 60000;
const gasPrice: number = 0.00000001;
const ttl: number = 60000;
const sender = 'not-real';
export const API_HOST: string = `https://api.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;

export const codeViewer = async (): Promise<void> => {
  const pactCommand = new PactCommand();
  pactCommand.code = createExp(`describe-module "coin"`);

  pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender, chainId });

  try {
    const response = await pactCommand.local(API_HOST, {
      signatureVerification: false,
      preflight: false,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
