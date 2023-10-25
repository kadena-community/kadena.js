import type { ChainId } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateTransferInput {
  sender: { account: string; publicKeys: string[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-two' | 'keys-one';
    };
  };
  amount: string;
  gasPayer?: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

const transferCreateCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
}: ICreateTransferInput) =>
  composePactCommand(
    execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        receiver.account,
        readKeyset('account-guard'),
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset('account-guard', receiver.keyset.pred, ...receiver.keyset.keys),
    addSigner(sender.publicKeys, (signFor) => [
      signFor('coin.TRANSFER', sender.account, receiver.account, {
        decimal: amount,
      }),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const transferCreate = (
  inputs: ICreateTransferInput,
  config: IClientConfig,
) => submitClient(config)(transferCreateCommand(inputs));
