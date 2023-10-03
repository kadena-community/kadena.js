import type {
  ChainId,
  IClient,
  ICommand,
  ICommandResult,
  IPollRequestPromise,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  addSignatures,
  createClient,
  isSignedTransaction,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';

import { devnetConfig } from './config';

export interface IAccount extends IKeyPair {
  account: string;
  chainId?: ChainId;
}

export interface IKeyPair {
  publicKey: string;
  secretKey?: string;
}

const getClient = (): IClient =>
  createClient(
    ({ chainId, networkId }) =>
      `http://localhost:${devnetConfig.PORT}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

export const submit = (tx: ICommand): Promise<ITransactionDescriptor> =>
  getClient().submit(tx);

export const listen = (tx: ITransactionDescriptor): Promise<ICommandResult> =>
  getClient().listen(tx);

export const pollCreateSpv = (
  tx: ITransactionDescriptor,
  chainId: ChainId,
): Promise<string> => getClient().pollCreateSpv(tx, chainId);

export const pollStatus = (
  tx: ITransactionDescriptor,
): IPollRequestPromise<ICommandResult> => getClient().pollStatus(tx);

export const dirtyRead = (tx: IUnsignedCommand): Promise<ICommandResult> =>
  getClient().dirtyRead(tx);

export const signTransaction =
  ({ publicKey, secretKey }: IKeyPair) =>
  (tx: IUnsignedCommand): IUnsignedCommand | ICommand => {
    const { sig } = sign(tx.cmd, {
      publicKey,
      secretKey,
    });
    if (!sig) throw Error('Failed to sign transaction');
    return addSignatures(tx, { sig, pubKey: publicKey });
  };

export const assertTransactionSigned = (
  tx: IUnsignedCommand | ICommand,
): ICommand => {
  const signed = isSignedTransaction(tx);
  if (!signed) throw Error('Failed to sign transaction');
  return tx;
};

export const signAndAssertTransaction =
  ({ publicKey, secretKey }: IKeyPair) =>
  (tx: IUnsignedCommand): ICommand => {
    const signedTx = signTransaction({ publicKey, secretKey })(tx);
    const assertedTx = assertTransactionSigned(signedTx);
    return assertedTx;
  };

export const inspect =
  (tag: string): (<T>(data: T) => T) =>
  <T>(data: T): T => {
    console.log(tag, data);
    return data;
  };

export const asyncPipe =
  (...fns: any[]) =>
  (value: any) => {
    return fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));
  };

export const createAccount = (
  chainId: ChainId = devnetConfig.CHAIN_ID,
): IAccount => {
  const generatedKeyPair = genKeyPair();

  return {
    publicKey: generatedKeyPair.publicKey,
    secretKey: generatedKeyPair.secretKey || '',
    account: `k:${generatedKeyPair.publicKey}`,
    chainId: chainId,
  };
};

export const sender00: IAccount = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  account: 'sender00',
};

export const getRandomChainId = (): ChainId => {
  const chainIds: ChainId[] = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
  ];

  const randomIndex = Math.floor(Math.random() * chainIds.length);
  return chainIds[randomIndex];
};
