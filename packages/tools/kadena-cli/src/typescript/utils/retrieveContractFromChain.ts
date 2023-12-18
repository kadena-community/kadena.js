import { ChainId } from '@kadena/types';
import { callLocal } from './callLocal.js';

export async function retrieveContractFromChain(
  module: string,
  host: string,
  networkId: string,
  chain: ChainId,
): Promise<string | undefined> {
  const now = new Date();
  const apiHost = `${host}/chainweb/0.0/${networkId}/chain/${chain}/pact`;

  console.log(apiHost);
  const createBody = (hash: string = ''): string =>
    `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chain}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${
      networkId
    }\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(describe-module \\\\\\"${module}\\\\\\")\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

  console.log(createBody());

  const { textResponse } = await callLocal(apiHost, createBody());

  console.log(textResponse);

  const hashFromResponse = textResponse?.split(' ').splice(-1, 1)[0];

  const { jsonResponse } = await callLocal(
    apiHost,
    createBody(hashFromResponse),
  );

  console.log(jsonResponse);

  return jsonResponse?.result.data.code;
}
