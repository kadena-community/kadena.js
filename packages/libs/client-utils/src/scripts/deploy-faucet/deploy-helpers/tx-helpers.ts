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

export const transaction =
  (chainId?: ChainId, noSender = false) =>
  (command: IPartialPactCommand | (() => IPartialPactCommand)) => {
    const client = submitClient({
      host: CHAINWEB_HOST,
      defaults: composePactCommand(
        setMeta({
          ...(noSender ? {} : { senderAccount: GAS_PAYER.ACCOUNT }),
          ...(chainId && { chainId }),
        }),
        setNetworkId(NETWORK_ID),
        noSender ? {} : addSigner(GAS_PAYER.PUBLIC_KEY),
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

export const read =
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

export const addChain = (chainId: ChainId, command: IPartialPactCommand) =>
  composePactCommand(command, setMeta({ chainId }));
