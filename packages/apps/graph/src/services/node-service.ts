import type { ChainId, IClient } from '@kadena/client';
import { createClient, Pact } from '@kadena/client';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ChainModuleAccountDetails = {
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: 'keys-all' | 'keys-any' | 'keys-two';
  };
};

function getClient(chainId: string): IClient {
  return createClient(
    `http://${process.env.NETWORK_HOST}/chainweb/0.0/${process.env.NETWORK_ID}/chain/${chainId}/pact`,
  );
}

export async function getAccountDetails(
  module: string,
  accountName: string,
  chainId: string,
): Promise<ChainModuleAccountDetails> {
  const commandResult = await getClient(chainId).local(
    Pact.builder
      .execution(
        // @ts-ignore
        Pact.modules[module].details(accountName),
      )
      .setMeta({
        chainId: chainId as ChainId,
      })
      .setNetworkId(process.env.NETWORK_ID as string)
      .createTransaction(),
    {
      preflight: false,
    },
  );

  if (commandResult.result.status !== 'success') {
    const error = {
      message: 'Failed with error',
      result: JSON.stringify(commandResult),
    };
    throw error;
  }

  const result = commandResult.result.data as unknown as any;

  if (typeof result.balance === 'object') {
    result.balance = parseFloat(result.balance.decimal);
  }

  return result as ChainModuleAccountDetails;
}
