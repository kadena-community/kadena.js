import type { IAccount } from '@devnet/utils';
import type { ICommandResult } from '@kadena/client';
import { Pact, createSignWithKeypair, readKeyset } from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { IPactDecimal } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';

export interface ICreateTokenInput {
  tokenId: string;
  creator: string;
  guard: IAccount;
  amount: IPactDecimal;
}

export async function mintToken({
  tokenId,
  creator,
  guard,
  amount,
}: ICreateTokenInput): Promise<ICommandResult> {
  const command = composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].mint(
        tokenId,
        creator,
        readKeyset('guard'),
        amount,
      ),
    ),
    addKeyset('guard', 'keys-all', ...guard.keys.map((key) => key.publicKey)),
    addSigner(
      guard.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.MINT', tokenId, creator, amount),
      ],
    ),
    setMeta({ senderAccount: guard.account, chainId: guard.chainId }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: networkData.networkId,
    },
    sign: createSignWithKeypair(guard.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  return result;
}
