import { IPactModules, Pact, PactReturnType, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import { IClientConfig } from '../core/utils/helpers';

export interface ITransferCreateTokenInput {
  tokenId: string;
  chainId: ChainId;
  sender: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: IPactDecimal;
}

export const createTransferTokenCommand = ({
  tokenId,
  chainId,
  sender,
  receiver,
  amount,
}: ITransferCreateTokenInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['transfer-create'](
        tokenId,
        sender.account,
        receiver.account,
        readKeyset('receiver-guard'),
        amount,
      ),
    ),
    addKeyset('receiver-guard', receiver.keyset.pred, ...receiver.keyset.keys),
    addSigner(sender.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor(
        'marmalade-v2.ledger.TRANSFER',
        tokenId,
        sender.account,
        receiver.account,
        amount,
      ),
    ]),
    setMeta({ senderAccount: sender.account, chainId }),
  );

export const transferCreateToken = (
  inputs: ITransferCreateTokenInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['transfer-create']>
  >(config)(createTransferTokenCommand(inputs));
