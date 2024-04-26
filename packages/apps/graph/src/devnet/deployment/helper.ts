import type {
  ChainId,
  IClient,
  ICommand,
  ICommandResult,
  IKeyPair,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';

export interface IAccount {
  account: string;
  chainId?: ChainId;
  keys: IKeyPair[];
}

let client: IClient | null = null;

const getClient = (): IClient => {
  if (!client) {
    client = createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
    );
  }
  return client;
};

export const submit = (tx: ICommand): Promise<ITransactionDescriptor> =>
  getClient().submit(tx);

export const listen = (tx: ITransactionDescriptor): Promise<ICommandResult> =>
  getClient().listen(tx);

export const signTransaction =
  (
    keyPairs: IKeyPair[],
  ): ((tx: IUnsignedCommand) => Promise<IUnsignedCommand | ICommand>) =>
  async (tx: IUnsignedCommand): Promise<IUnsignedCommand | ICommand> => {
    const signWithKeypair = createSignWithKeypair(keyPairs);
    const signedTx = await signWithKeypair(tx);

    return signedTx;
  };

export const assertTransactionSigned = (
  tx: IUnsignedCommand | ICommand,
): ICommand => {
  const signed = isSignedTransaction(tx);
  if (!signed) throw Error('Failed to sign transaction');
  return tx;
};

export const signAndAssertTransaction =
  (keyPairs: IKeyPair[]): ((tx: IUnsignedCommand) => Promise<ICommand>) =>
  async (tx: IUnsignedCommand): Promise<ICommand> => {
    const signedTx = await signTransaction(keyPairs)(tx);
    const assertedTx = assertTransactionSigned(signedTx);
    return assertedTx;
  };

export const inspect =
  (tag: string): (<T>(data: T) => T) =>
  <T>(data: T): T => {
    logger.info(tag, data);
    return data;
  };
