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

export interface CodeResult {
  reqKey: string;
  status: string;
  code?: string;
}

export const codeViewer = async (
  moduleName: string,
  chainId: ChainId,
): Promise<CodeResult> => {
  const pactCommand = new PactCommand();
  pactCommand.code = createExp(`describe-module "${moduleName}"`);

  pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender, chainId });

  try {
    const response = await pactCommand.local(API_HOST, {
      signatureVerification: false,
      preflight: false,
    });

    const { reqKey, result } = response;

    return {
      reqKey,
      status: result.status,
      code: result.data.code,
    };
  } catch (error) {
    console.log(error);
    return { reqKey: '', status: 'error', code: '' };
  }
};
