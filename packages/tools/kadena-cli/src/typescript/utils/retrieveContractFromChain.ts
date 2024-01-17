import type { ChainId } from '@kadena/types';
import { describeModule } from '@kadena/client-utils/built-in';

export async function retrieveContractFromChain(
  module: string,
  host: string,
  networkId: string,
  chainId: ChainId,
): Promise<string | undefined> {
  const moduleDescription = await describeModule(
    module,
    {
      host,
      defaults: {
        networkId,
        meta: {
          chainId,
        },
      },
    },
  );

  return moduleDescription.code;
}
