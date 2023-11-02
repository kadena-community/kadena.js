import type { ChainId, ICommandResult, IUnsignedCommand } from '@kadena/client';
import { Pact } from '@kadena/client';
import { hash } from '@kadena/cryptography-utils';
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
  submit,
} from './helper';

export async function transfer({
  publicKey,
  chainId = devnetConfig.CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  publicKey: string;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const account = `k:${publicKey}`;
  const pactAmount = new PactNumber(amount).toPactDecimal();

  logger.info(
    `Transfering from ${sender.account} to ${account}\nPublic Key: ${publicKey}\nAmount: ${pactAmount.decimal}`,
  );

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        account,
        () => '(read-keyset "ks")',
        pactAmount,
      ),
    )
    .addData('ks', { keys: [publicKey], pred: 'keys-all' })
    .addSigner(sender.publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', sender.account, account, pactAmount),
    ])
    .setMeta({
      gasLimit: 1000,
      chainId,
      senderAccount: sender.account,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .createTransaction();

  logger.info('TRANSACTION', transaction);

  const signedTx = signAndAssertTransaction([sender])(transaction);

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

export const dummyTransaction = async (cmd: string): Promise<void> => {
  // const transaction = Pact.builder
  //   .execution(jsonTransaction)
  //   .createTransaction();

  const generatedHash = hash(cmd);

  const transaction: IUnsignedCommand = {
    cmd,
    hash: generatedHash,
    sigs: [],
  };

  // hash = crypto.getRandomValues
  console.log(transaction);

  const localRead = await localReadForGasEstimation(transaction);
  console.log(localRead);
};
