import { PactCommand } from '@kadena/client';

const NETWORK_ID: any = 'mainnet01';
const chainId: string = '1';
const gasLimit: number = 60000;
const gasPrice: number = 0.00000001;
const ttl: number = 60000;
const sender = 'not-real';
export const API_HOST: string = `https://api.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;

export const codeViewer = async (): Promise<void> => {
  //module: string = 'coin'
  const pactCommand = new PactCommand();
  pactCommand.code = `(describe-module "coin")`;

  pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender });

  try {
    const response = await pactCommand.send(API_HOST);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
