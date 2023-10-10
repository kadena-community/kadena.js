import type { ChainId } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import type { IClientConfig } from '../client-utils/helpers';
import { crossChainClient } from '../client-utils/rich-client';

interface ICrossChainInput {
  sender: { account: string; publicKeys: string[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-two' | 'keys-one';
    };
  };
  amount: string;
  targetChainId: ChainId;
  targetChainGasPayer: { account: string; publicKeys: string[] };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

const createAccountCommand = ({
  sender,
  receiver,
  amount,
  targetChainId,
  gasPayer = sender,
  chainId,
}: Omit<ICrossChainInput, 'targetChainGasPayer'>) =>
  composePactCommand(
    execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        sender.account,
        amount,
        readKeyset('account-guard'),
        targetChainId,
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset('account-guard', receiver.keyset.pred, ...receiver.keyset.keys),
    addSigner(sender.publicKeys, (withCapability) => [
      withCapability(
        'coin.TRANSFER_XCHAIN',
        sender.account,
        receiver.account,
        { decimal: amount },
        targetChainId,
      ),
    ]),
    addSigner(gasPayer.publicKeys, (withCapability) => [
      withCapability('coin.GAS'),
    ]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

export const createAccount = (
  inputs: ICrossChainInput,
  config: IClientConfig,
) =>
  crossChainClient(config)(inputs.targetChainId, inputs.targetChainGasPayer)(
    createAccountCommand(inputs),
  );
