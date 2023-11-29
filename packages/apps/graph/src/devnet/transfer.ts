import type { ChainId, ICommandResult, IUnsignedCommand } from '@kadena/client';
import { Pact } from '@kadena/client';
import { hash as hashFunction } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';
import { devnetConfig } from './config';
import type { IAccount } from './helper';
import {
  inspect,
  listen,
  localReadForGasEstimation,
  logger,
  sender00,
  signAndAssertTransaction,
  stringifyProperty,
  submit,
} from './helper';

export async function transfer({
  receiver,
  chainId = devnetConfig.CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  receiver: IAccount;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const pactAmount = new PactNumber(amount).toPactDecimal();

  logger.info(
    `Transfering from ${sender.account} to ${
      receiver.account
    }\nPublic Key: ${stringifyProperty(receiver.keys, 'publicKey')}\nAmount: ${
      pactAmount.decimal
    }`,
  );

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        receiver.account,
        () => '(read-keyset "ks")',
        pactAmount,
      ),
    )
    .addData('ks', {
      keys: receiver.keys.map((key) => key.publicKey),
      pred: 'keys-all',
    })
    .addSigner(
      sender.keys.map((key) => key.publicKey),
      (withCap) => [
        withCap('coin.GAS'),
        withCap('coin.TRANSFER', sender.account, receiver.account, pactAmount),
      ],
    )
    .setMeta({
      gasLimit: 1000,
      chainId,
      senderAccount: sender.account,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(devnetConfig.NETWORK_ID)

    .createTransaction();

  console.log(transaction);

  const signedTx = signAndAssertTransaction(sender.keys)(transaction);

  const transactionDescriptor = await submit(signedTx);
  inspect('Transfer Submited')(transactionDescriptor);

  const result = await listen(transactionDescriptor);
  inspect('Transfer Result')(result);
  if (result.result.status === 'failure') {
    throw result.result.error;
  } else {
    logger.info(result.result);
    return result;
  }
}
export const localReadTransfer = async ({
  cmd,
  hash = undefined,
  sigs = [],
}: {
  cmd: string;
  hash?: string | undefined | null;
  sigs?: string[] | undefined | null;
}): Promise<ICommandResult> => {
  if (!hash) {
    hash = hashFunction(cmd);
  }

  let existingSigs: IUnsignedCommand['sigs'] = [];

  if (sigs && sigs?.length > 0) {
    existingSigs = sigs.map((sig) => ({
      sig: sig,
    }));
  }

  const transaction: IUnsignedCommand = {
    cmd,
    hash,
    sigs: existingSigs,
  };

  return await localReadForGasEstimation(transaction);
};
