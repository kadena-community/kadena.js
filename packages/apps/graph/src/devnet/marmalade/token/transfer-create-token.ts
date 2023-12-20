import { IAccount, logger } from '@devnet/helper';
import { Pact, createSignWithKeypair, readKeyset } from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { IPactDecimal } from '@kadena/types';
import { dotenv } from '@utils/dotenv';

export interface ITransferCreateTokenInput {
  tokenId: string;
  sender: IAccount;
  receiver: IAccount;
  amount: IPactDecimal;
}

export async function transferCreateToken({
  tokenId,
  sender,
  receiver,
  amount,
}: ITransferCreateTokenInput) {
  const command = composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['transfer-create'](
        tokenId,
        sender.account,
        receiver.account,
        readKeyset('receiver-guard'),
        amount,
      ),
    ),
    addKeyset(
      'receiver-guard',
      'keys-all',
      ...receiver.keys.map((key) => key.publicKey),
    ),
    addSigner(
      sender.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor(
          'marmalade-v2.ledger.TRANSFER',
          tokenId,
          sender.account,
          receiver.account,
          amount,
        ),
      ],
    ),
    setMeta({ senderAccount: sender.account, chainId: sender.chainId }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
    sign: createSignWithKeypair(sender.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  return result;
}
