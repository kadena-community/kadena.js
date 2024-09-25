import type { ChainId, IPartialPactCommand } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { dirtyReadClient, submitClient } from '../../../core/client-helpers';
import {
  CHAINWEB_HOST,
  GAS_PAYER,
  NETWORK_ID,
  PRIVATE_SIGNER,
} from './constants';
const log = (tag: string) => (data: any) =>
  console.log(tag, JSON.stringify(data, null, 2));

export const transaction =
  (chainId?: ChainId) =>
  (command: IPartialPactCommand | (() => IPartialPactCommand)) =>
    submitClient({
      host: CHAINWEB_HOST,
      defaults: composePactCommand(
        setMeta({
          // senderAccount: GAS_PAYER.ACCOUNT,
          ...(chainId && { chainId }),
        }),
        setNetworkId(NETWORK_ID),
        // addSigner(GAS_PAYER.PUBLIC_KEY, (signFor) => [signFor('coin.GAS')]),
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
    })(command)
      .on('sign', log('command'))
      .on('preflight', log('preflight'))
      .on('listen', log('poll'))
      .on('submit', log('submit'))
      .on('poll' as any, log('request'))
      .execute();

export const read =
  (chainId?: ChainId) =>
  (command: IPartialPactCommand | (() => IPartialPactCommand)) =>
    dirtyReadClient({
      host: CHAINWEB_HOST,
      defaults: composePactCommand(
        setMeta({
          ...(chainId && { chainId }),
        }),
        setNetworkId(NETWORK_ID),
      )(),
      // replace this with other sign methods if needed
    })(command).execute();

export const addChain = (chainId: ChainId, command: IPartialPactCommand) =>
  composePactCommand(command, setMeta({ chainId }));
