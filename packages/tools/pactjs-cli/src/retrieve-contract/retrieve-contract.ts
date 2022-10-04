import { TOptions } from '.';

import { Command } from 'commander';
import fetch from 'cross-fetch';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface INetworks {
  mainnet: { network: 'mainnet01'; api: 'api.chainweb.com' };
  testnet: {
    network: 'testnet04';
    api: 'api.testnet.chainweb.com';
  };
}

const networkMap: INetworks = {
  mainnet: { network: 'mainnet01', api: 'api.chainweb.com' },
  testnet: { network: 'testnet04', api: 'api.testnet.chainweb.com' },
} as const;

export function retrieveContract(
  program: Command,
  version: string,
): (args: TOptions) => Promise<void> {
  return async function action({ module, out, network, chain }: TOptions) {
    const now = new Date();

    const createBody = (hash: string = ''): string =>
      `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chain}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${
        networkMap[network].network
      }\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(describe-module \\\\\\"${module}\\\\\\")\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

    const { textResponse } = await callLocal(network, chain, createBody());

    const hashFromResponse = textResponse?.split(' ').splice(-1, 1)[0];

    const { jsonResponse } = await callLocal(
      network,
      chain,
      createBody(hashFromResponse),
    );

    const code = jsonResponse?.result.data.code;

    if (code !== undefined && code.length !== 0) {
      writeFileSync(join(process.cwd(), out), code, 'utf8');
    }
  };
}

async function callLocal(
  network: TOptions['network'],
  chain: TOptions['chain'],
  body: string,
): Promise<{
  textResponse: string | undefined;
  jsonResponse:
    | {
        result: {
          data: { code: string };
        };
      }
    | undefined;
  response: Response;
}> {
  const response = await fetch(
    `https://${networkMap[network].api}/chainweb/0.0/` +
      `${networkMap[network].network}/chain/${chain}/pact/api/v1/local`,
    {
      headers: {
        accept: 'application/json;charset=utf-8, application/json',
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=utf-8',
        pragma: 'no-cache',
      },
      body,
      method: 'POST',
    },
  );

  let jsonResponse;
  let textResponse;

  try {
    jsonResponse = (await response.clone().json()) as {
      result: { data: { code: string } };
    };
  } catch (e) {
    textResponse = await response.text();
  }
  return { textResponse, jsonResponse, response };
}
