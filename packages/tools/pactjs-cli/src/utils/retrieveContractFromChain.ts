import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { callLocal } from './callLocal';
import { networkMap } from './networkMap';

export async function retrieveContractFromChain(
  module: string,
  apiHost: string,
  chain: number | string,
  network: string,
): Promise<string | undefined> {
  const command = Pact.builder
    .execution(`(describe-module "${module}")`)
    .setNetworkId(
      network === 'testnet' || network === 'mainnet'
        ? networkMap[network].network
        : network,
    )
    .setMeta({ chainId: chain.toString() as ChainId })
    .createTransaction();

  const { jsonResponse } = await callLocal(apiHost, JSON.stringify(command));

  return jsonResponse?.result.data.code;
}
