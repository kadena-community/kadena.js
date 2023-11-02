import type { ChainId, IClient, ICommandResult } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { dotenv } from '@src/utils/dotenv';

export class PactCommandError extends Error {
  public commandResult: ICommandResult;
  public pactError: any;

  constructor(message: string, commandResult: ICommandResult, pactError?: any) {
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
): Promise<ChainModuleAccountDetails | null> {
  const commandResult = await getClient(chainId as ChainId).dirtyRead(
    Pact.builder
      .execution(Pact.modules[module as 'fungible-v2'].details(accountName))
      .setMeta({
        chainId: chainId as ChainId,
      })
      .setNetworkId(dotenv.NETWORK_ID)
      .createTransaction(),
  );

  if (commandResult.result.status !== 'success') {
    // If the account does not exist on a chain, we get a row not found error.
    if (
      (commandResult.result.error as any).message?.includes(
        'with-read: row not found',
      )
    ) {
      return null;
    } else {
      throw new PactCommandError(
        'Pact Command failed with error',
        commandResult,
        commandResult.result.error,
      );
    }
  }

  const result = commandResult.result.data as unknown as any;

  if (typeof result.balance === 'object') {
    result.balance = parseFloat(result.balance.decimal);
  }

  return result as ChainModuleAccountDetails;
}

export async function sendRawQuery(code: string, chainId: string) {
  try {
    const commandResult = await getClient(chainId as ChainId).dirtyRead(
      Pact.builder
        .execution(code)
        .setMeta({
          chainId: chainId as ChainId,
        })
        .setNetworkId(dotenv.NETWORK_ID)
        .createTransaction(),
    );

    return JSON.stringify(commandResult.result);
  } catch (error) {
    throw new PactCommandError('Pact Command failed with error', error);
  }
}
