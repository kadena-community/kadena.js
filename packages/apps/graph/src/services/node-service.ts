import type { ChainId, IClient, ICommandResult } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { dotenv } from '../utils/dotenv';

export class PactCommandError extends Error {
  public commandResult: ICommandResult;
  public pactError: any;

  constructor(message: string, commandResult: ICommandResult, pactError: any) {
    super(message);
    this.commandResult = commandResult;
    this.pactError = pactError;
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ChainModuleAccountDetails = {
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: 'keys-all' | 'keys-any' | 'keys-two';
  };
};

function getClient(chainId: ChainId): IClient {
  return createClient(
    `http://${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
  );
}

export async function getAccountDetails(
  module: string,
  accountName: string,
  chainId: string,
): Promise<ChainModuleAccountDetails> {
  const commandResult = await getClient(chainId as ChainId).dirtyRead(
    Pact.builder
      .execution(Pact.modules[module as 'fungible-v2'].details(accountName))
      .setMeta({
        chainId: chainId as ChainId,
      })
      .setNetworkId(dotenv.NETWORK_ID as string)
      .createTransaction(),
  );

  if (commandResult.result.status !== 'success') {
    throw new PactCommandError(
      'Pact Command failed with error',
      commandResult,
      commandResult.result.error,
    );
  }

  const result = commandResult.result.data as unknown as any;

  if (typeof result.balance === 'object') {
    result.balance = parseFloat(result.balance.decimal);
  }

  return result as ChainModuleAccountDetails;
}
