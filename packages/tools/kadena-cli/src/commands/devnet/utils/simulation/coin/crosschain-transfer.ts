import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCrossChain } from '@kadena/client-utils/coin';
import type { IAccount } from '../../../../../constants/devnets.js';
import { defaultAccount } from '../../../../../constants/devnets.js';
import { log } from '../../../../../utils/logger.js';

export async function crossChainTransfer({
  network,
  sender,
  receiver,
  amount,
  gasPayer,
}: {
  network: { host: string; id: string };
  sender: IAccount;
  receiver: IAccount;
  amount: number;
  gasPayer: IAccount;
}): Promise<ICommandResult> {
  // Gas Payer validations
  if (gasPayer.chainId !== receiver.chainId && gasPayer !== defaultAccount) {
    log.warning(
      `Gas payer ${gasPayer.account} does not for sure have an account on the receiver chain; using ${defaultAccount.account} as gas payer`,
    );
    gasPayer = defaultAccount;
  }

  if (!gasPayer.keys.some((key) => key.secretKey)) {
    log.warning(
      `Gas payer ${gasPayer.account} does not have a secret key; using ${defaultAccount.account} as gas payer`,
    );
    gasPayer = defaultAccount;
  }

  log.info(
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
      host: network.host,
      defaults: {
        networkId: network.id,
      },
      sign: createSignWithKeypair([...sender.keys, ...gasPayer.keys]),
    },
  );

  return crossChainTransferRequest.executeTo('listen-continuation');
}
