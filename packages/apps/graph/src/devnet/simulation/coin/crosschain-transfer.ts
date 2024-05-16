import type { IAccount } from '@devnet/utils';
import { sender00 } from '@devnet/utils';
import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCrossChain } from '@kadena/client-utils/coin';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';
import { networkData } from '@utils/network';

export async function crossChainTransfer({
  sender,
  receiver,
  amount,
  gasPayer = sender00,
}: {
  sender: IAccount;
  receiver: IAccount;
  amount: number;
  gasPayer?: IAccount;
}): Promise<ICommandResult> {
  // Gas Payer validations
  if (gasPayer.chainId !== receiver.chainId && gasPayer !== sender00) {
    logger.info(
      `Gas payer ${gasPayer.account} does not for sure have an account on the receiver chain; using sender00 as gas payer`,
    );
    gasPayer = sender00;
  }

  if (!gasPayer.keys.map((key) => key.secretKey)) {
    logger.info(
      `Gas payer ${gasPayer.account} does not have a secret key; using sender00 as gas payer`,
    );
    gasPayer = sender00;
  }

  logger.info(
    `Crosschain Transfer from ${sender.account}, chain ${sender.chainId}\nTo ${receiver.account}, chain ${receiver.chainId}\nAmount: ${amount}\nGas Payer: ${gasPayer.account}`,
  );

  const crossChainTransferRequest = transferCrossChain(
    {
      sender: {
        account: sender.account,
        publicKeys: sender.keys.map((key) => key.publicKey),
      },
      receiver: {
        account: receiver.account,
        keyset: {
          keys: receiver.keys.map((key) => key.publicKey),
          pred: 'keys-all',
        },
      },
      targetChainGasPayer: {
        account: gasPayer.account,
        publicKeys: gasPayer.keys.map((key) => key.publicKey),
      },
      chainId: sender.chainId as ChainId,
      targetChainId: receiver.chainId as ChainId,
      amount: amount.toString(),
    },
    {
      host: dotenv.NETWORK_HOST,
      defaults: {
        networkId: networkData.networkId,
      },
      sign: createSignWithKeypair([...sender.keys, ...gasPayer.keys]),
    },
  );

  return crossChainTransferRequest.executeTo('listen-continuation');
}
