import type { IClient, ICommandResult } from '@kadena/client';
import { isSignedTransaction } from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';
import type { ICommand, IUnsignedCommand, PactValue } from '@kadena/types';

export function getCmdDataOrFail<T = PactValue>(response: ICommandResult): T {
  if (response.result.status === 'failure') {
    throw new Error(JSON.stringify(response.result.error));
  } else {
    return response.result.data as T;
  }
}

export type KdaClient = IClient | (() => IClient);
function getClient(client: KdaClient) {
  return typeof client === 'function' ? client() : client;
}

export async function dirtyReadOrFail<T = PactValue>(
  client: KdaClient,
  tx: IUnsignedCommand | ICommand,
): Promise<T> {
  const res = await getClient(client).dirtyRead(tx);
  return getCmdDataOrFail<T>(res);
}

export function createDirtyReadOrFail(client: KdaClient) {
  return dirtyReadOrFail.bind(null, client) as <T>(
    tx: IUnsignedCommand | ICommand,
  ) => Promise<T>;
}

export async function localOrFail<T = PactValue>(
  client: KdaClient,
  tx: IUnsignedCommand | ICommand,
): Promise<T> {
  const res = await getClient(client).local(tx);
  return getCmdDataOrFail<T>(res);
}

export function createLocalOrFail(client: KdaClient) {
  return localOrFail.bind(null, client) as <T>(
    tx: IUnsignedCommand | ICommand,
  ) => Promise<T>;
}

export async function submitAndListen<T>(
  client: KdaClient,
  signedTx: IUnsignedCommand | ICommand,
): Promise<T> {
  if (isSignedTransaction(signedTx)) {
    const request = await getClient(client).submit(signedTx);
    const response = await getClient(client).listen(request);
    return getCmdDataOrFail<T>(response);
  } else {
    throw new Error('Not signed');
  }
}

export function createSubmitAndListen(client: KdaClient) {
  return submitAndListen.bind(null, client) as <T>(
    signedTx: IUnsignedCommand | ICommand,
  ) => Promise<T>;
}

export function createKdaClientHelpers(client: KdaClient) {
  return {
    dirtyReadOrFail: createDirtyReadOrFail(client),
    localOrFail: createLocalOrFail(client),
    submitAndListen: createSubmitAndListen(client),
  };
}

export function getAccountKey(account: string) {
  return account.split(':')[1];
}

export function generateKAccount() {
  const { publicKey, secretKey } = genKeyPair();
  return {
    publicKey,
    secretKey,
    account: `k:${publicKey}`,
  };
}

export function generateKAccounts(count = 10) {
  return Array.from({ length: count }, () => generateKAccount());
}

export function pactDecimal(amount: string | number) {
  return {
    decimal: typeof amount === 'string' ? amount : amount.toFixed(12),
  };
}
