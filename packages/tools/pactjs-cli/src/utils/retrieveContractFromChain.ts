import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { fetchModule } from './callLocal';
import { networkMap } from './networkMap';

export async function retrieveContractFromChain(
  module: string,
  apiHost: string,
  chain: number | string,
  network: keyof typeof networkMap,
): Promise<string> {
  const command = Pact.builder
    .execution(`(describe-module "${module}")`)
    .setNetworkId(networkMap[network].network)
    .setMeta({ chainId: chain.toString() as ChainId })
    .createTransaction();

  const { code, error } = await fetchModule(apiHost, JSON.stringify(command));

  // console.log({ code, error });

  if (error !== undefined) {
    throw new Error(
      `Could not retrieve ${module} from network:${network} - chain:${chain}\nerror: ${error}`,
    );
  }

  return code;
}
