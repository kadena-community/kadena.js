import type { ChainId, IPartialPactCommand } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { submitClient } from '../../../core/client-helpers';
import { CHAINWEB_HOST, GAS_PAYER, NETWORK_ID } from './constants';

export const transaction =
  (chainId?: ChainId) =>
  (command: IPartialPactCommand | (() => IPartialPactCommand)) =>
    submitClient({
      host: CHAINWEB_HOST,
      defaults: composePactCommand(
        setMeta({
          senderAccount: GAS_PAYER.ACCOUNT,
          ...(chainId && { chainId }),
        }),
        setNetworkId(NETWORK_ID),
        addSigner(GAS_PAYER.PUBLIC_KEY, (signFor) => [signFor('coin.GAS')]),
      )(),
      // replace this with other sign methods if needed
      sign: createSignWithKeypair([
        {
          publicKey: GAS_PAYER.PUBLIC_KEY,
          secretKey: GAS_PAYER.SECRET_KEY,
        },
        // add more keypairs if needed
      ]),
    })(command).execute();

export const addChain = (chainId: ChainId, command: IPartialPactCommand) =>
  composePactCommand(command, setMeta({ chainId }));
