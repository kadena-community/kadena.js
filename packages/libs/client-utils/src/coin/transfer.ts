import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ITransferInput {
  sender: { account: string; publicKeys: string[] };
  receiver: string;
  amount: string;
  gasPayer?: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

const transferCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
}: ITransferInput) =>
  composePactCommand(
    execution(
      Pact.modules.coin.transfer(sender.account, receiver, {
        decimal: amount,
      }),
    ),
    addSigner(sender.publicKeys, (withCapability) => [
      withCapability('coin.TRANSFER', sender.account, receiver, {
        decimal: amount,
      }),
    ]),
    addSigner(gasPayer.publicKeys, (withCapability) => [
      withCapability('coin.GAS'),
    ]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

export const transfer = (inputs: ITransferInput, config: IClientConfig) =>
  submitClient(config)(transferCommand(inputs));
