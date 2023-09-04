import { callLocal } from './callLocal';
import { networkMap } from './networkMap';

export async function retrieveContractFromChain(
  module: string,
  apiHost: string,
  chain: number,
  network: keyof typeof networkMap,
): Promise<string | undefined> {
  const now = new Date();

  const createBody = (hash: string = ''): string =>
    `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chain}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${
      networkMap[network].network
    }\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(describe-module \\\\\\"${module}\\\\\\")\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

  const { textResponse } = await callLocal(apiHost, createBody());

  const hashFromResponse = textResponse?.split(' ').splice(-1, 1)[0];

  const { jsonResponse } = await callLocal(
    apiHost,
    createBody(hashFromResponse),
  );

  return jsonResponse?.result.data.code;
}
