import type { ChainId, ICommandResult } from '@kadena/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { dotenv } from '@utils/dotenv';
import type { IAccount } from './helper';
import {
  inspect,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  stringifyProperty,
  submit,
} from './helper';

export async function transfer({
  receiver,
  chainId = dotenv.SIMULATE_DEFAULT_CHAIN_ID,
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
    .setNetworkId(dotenv.NETWORK_ID)

    .createTransaction();

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
