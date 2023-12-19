import type { ChainId, IClient, ICommandResult } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { dotenv } from '@utils/dotenv';
import type { Guard } from '../graph/types/graphql-types';

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
export type CommandData = {
  key: string;
  value: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ChainFungibleAccountDetails = {
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: Guard['predicate'];
  };
};

function getClient(chainId: ChainId): IClient {
  return createClient(
    `http://${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
  );
}

export async function getAccountDetails(
  fungibleName: string,
  accountName: string,
  chainId: string,
): Promise<ChainFungibleAccountDetails | null> {
  const commandResult = await getClient(chainId as ChainId).dirtyRead(
    Pact.builder
      .execution(
        Pact.modules[fungibleName as 'fungible-v2'].details(accountName),
      )
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

  return result as ChainFungibleAccountDetails;
}

export async function sendRawQuery(
  code: string,
  chainId: string,
  data?: CommandData[],
): Promise<string> {
  const commandBuilder = Pact.builder
    .execution(code)
    .setMeta({
      chainId: chainId as ChainId,
    })
    .setNetworkId(dotenv.NETWORK_ID);

  if (data) {
    data.forEach((data) => {
      commandBuilder.addData(data.key, data.value);
    });
  }

  const commandResult = await getClient(chainId as ChainId).dirtyRead(
    commandBuilder.createTransaction(),
  );

  if (commandResult.result.status !== 'success') {
    throw new PactCommandError(
      'Pact Command failed with error',
      commandResult,
      commandResult.result.error,
    );
  }

  return JSON.stringify(commandResult.result.data);
}
