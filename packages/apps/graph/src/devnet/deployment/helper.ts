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
  addSignatures,
  createClient,
  isSignedTransaction,
} from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';

export interface IAccount {
  account: string;
  chainId?: ChainId;
  keys: IKeyPair[];
}

const getClient = (): IClient =>
  createClient(
    ({ chainId }) =>
      `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
  );

export const submit = (tx: ICommand): Promise<ITransactionDescriptor> =>
  getClient().submit(tx);

export const listen = (tx: ITransactionDescriptor): Promise<ICommandResult> =>
  getClient().listen(tx);

export const signTransaction =
  (keyPairs: IKeyPair[]) =>
  (tx: IUnsignedCommand): IUnsignedCommand | ICommand => {
    const signedTx = keyPairs.reduce((acc, keyPair) => {
      const { sig } = sign(acc.cmd, {
        publicKey: keyPair.publicKey,
        secretKey: keyPair.secretKey,
      });
      if (!sig) throw Error('Failed to sign transaction');
      return addSignatures(acc, { sig, pubKey: keyPair.publicKey });
    }, tx);
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
  (keyPairs: IKeyPair[]) =>
  (tx: IUnsignedCommand): ICommand => {
    const signedTx = signTransaction(keyPairs)(tx);
    const assertedTx = assertTransactionSigned(signedTx);
    return assertedTx;
  };

export const inspect =
  (tag: string): (<T>(data: T) => T) =>
  <T>(data: T): T => {
    logger.info(tag, data);
    return data;
  };
