import type { ChainId, IPartialPactCommand } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { dirtyReadClient, submitClient } from '../../../core/client-helpers';
import {
  CHAINWEB_HOST,
  DEBUG_MODE,
  GAS_PAYER,
  NETWORK_ID,
  PRIVATE_SIGNER,
} from './constants';

const consoleLog = (chainId?: ChainId) => (tag: string) => (data: any) =>
  console.log(
    chainId ? `ch #${chainId}` : '',
    tag,
    JSON.stringify(data, null, 2),
  );

const transaction =
  (chainId?: ChainId) =>
  (
    command: IPartialPactCommand | (() => IPartialPactCommand),
    { noDefaultSender } = { noDefaultSender: false },
  ) => {
    const client = submitClient({
      host: CHAINWEB_HOST,
      defaults: composePactCommand(
        setMeta({
          ...(noDefaultSender ? {} : { senderAccount: GAS_PAYER.ACCOUNT }),
          ...(chainId && { chainId }),
        }),
        setNetworkId(NETWORK_ID),
        noDefaultSender ? {} : addSigner(GAS_PAYER.PUBLIC_KEY),
      )(),
      // replace this with other sign methods if needed
      sign: createSignWithKeypair([
        {
          publicKey: GAS_PAYER.PUBLIC_KEY,
          secretKey: GAS_PAYER.SECRET_KEY,
        },
        {
          publicKey: PRIVATE_SIGNER.PUBLIC_KEY,
          secretKey: PRIVATE_SIGNER.SECRET_KEY,
        },
        // add more keypairs if needed
      ]),
    })(command);

    const log = consoleLog(chainId);

    if (DEBUG_MODE) {
      client
        .on('sign', log('command'))
        .on('preflight', log('preflight'))
        .on('submit', log('send'))
        .on('listen', log('result'))
        .on('poll' as any, log('poll'));
    }

    return client.execute();
  };

const read =
  (chainId?: ChainId) =>
  (command: string | IPartialPactCommand | (() => IPartialPactCommand)) => {
    const cmd = typeof command === 'string' ? execution(command) : command;
    return dirtyReadClient({
      host: CHAINWEB_HOST,
      defaults: composePactCommand(
        setMeta({
          ...(chainId && { chainId }),
        }),
        setNetworkId(NETWORK_ID),
      )(),
      // replace this with other sign methods if needed
    })(cmd).execute();
  };

interface IKadenaContext {
  (
    chainId: ChainId,
  ): <T>(
    cb: (fns: {
      chainId: ChainId;
      transaction: ReturnType<typeof transaction>;
      read: ReturnType<typeof read>;
    }) => Promise<T>,
  ) => Promise<T>;
  (
    chainIds: ChainId[],
  ): <T>(
    cb: (fns: {
      chainId: ChainId;
      transaction: ReturnType<typeof transaction>;
      read: ReturnType<typeof read>;
    }) => Promise<T>,
  ) => Promise<T[]>;
}

export const kadenaContext = ((chainIds: ChainId | ChainId[]) => async (cb) => {
  const chains = Array.isArray(chainIds) ? chainIds : [chainIds];
  const results = await Promise.all(
    chains.map(async (chainId) => {
      const transactionFn = transaction(chainId);
      const readFn = read(chainId);
      return cb({
        transaction: transactionFn,
        read: readFn,
        chainId,
      });
    }),
  );
  return Array.isArray(chainIds) ? results : results[0];
}) as IKadenaContext;
