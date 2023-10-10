import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import type { IClientConfig } from '../client-utils/helpers';
import { submitClient } from '../client-utils/rich-client';

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

export const createAccount = (inputs: ITransferInput, config: IClientConfig) =>
  submitClient(config)(transferCommand(inputs));
