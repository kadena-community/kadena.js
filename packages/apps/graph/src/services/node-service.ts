import { ChainId, Pact, createClient } from '@kadena/client';

function getClient(chainId: string) {
  return createClient(
    `http://${process.env.NETWORK_HOST}/chainweb/0.0/${process.env.NETWORK_ID}/chain/${chainId}/pact`,
  );
}

export async function getBalance(
  module: string,
  accountName: string,
  chainId: string,
) {
  const commandResult = await getClient(chainId).local(
    Pact.builder
      .execution(
        // @ts-ignore
        Pact.modules[module]['get-balance'](accountName),
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
    throw { message: 'Failed with error', result: JSON.stringify(commandResult) };
  }

  return commandResult.result.data as number;
}
