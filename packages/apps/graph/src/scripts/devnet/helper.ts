import type {
  ICommand,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  addSignatures,
  createClient,
  isSignedTransaction,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';

import constants from './config';

export interface IAccount {
  publicKey: string;
  secretKey: string;
  account: string;
}

const getClient = () =>
  createClient(
    ({ chainId, networkId }) =>
      `http://localhost:${constants.PORT}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

export const submit = (tx: ICommand) => getClient().submit(tx);
export const listen = (tx: ITransactionDescriptor) => getClient().listen(tx);

export const signTransaction =
  ({ publicKey, secretKey }: { publicKey: string; secretKey: string }) =>
  (tx: IUnsignedCommand) => {
    const { sig } = sign(tx.cmd, {
      publicKey,
      secretKey,
    });
    if (!sig) throw Error('Failed to sign transaction');
    return addSignatures(tx, { sig, pubKey: publicKey });
  };

export const assertTransactionSigned = (tx: IUnsignedCommand | ICommand) => {
  const signed = isSignedTransaction(tx);
  if (!signed) throw Error('Failed to sign transaction');
  return tx;
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

export const createAccount = (): IAccount => {
  const generatedKeyPair = genKeyPair();

  return {
    publicKey: generatedKeyPair.publicKey,
    secretKey: generatedKeyPair.secretKey || '',
    account: `k:${generatedKeyPair.publicKey}`,
  };
};

export const sender00: IAccount = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  account: 'sender00',
};
