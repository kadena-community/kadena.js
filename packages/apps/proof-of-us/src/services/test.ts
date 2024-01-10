import { Pact, createClient } from '@kadena/client';
import { getApiHost, getChainId, getNetworkId } from './config';

export const main = async (account: string) => {
  const client = createClient(getApiHost());

  const transaction = Pact.builder
    .execution(`(coin.details "${account}")`)
    .setMeta({ chainId: getChainId() })
    .setNetworkId(getNetworkId())
    .createTransaction();

  try {
    const response = await client.dirtyRead(transaction);

    const { result } = response;

    if (result.status === 'success') {
      console.log(result.data);
    } else {
      console.error(result.error);
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
  }
};
