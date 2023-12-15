import { devnetConfig } from '@devnet/config';
import {
  IAccount,
  dirtyRead,
  inspect,
  listen,
  sender00,
  signAndAssertTransaction,
  submit,
} from '@devnet/helper';
import { Pact, literal } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export async function transferToken({
  tokenId,
  sender,
  receiver,
  amount = 1,
}: {
  tokenId: string;
  sender?: IAccount;
  receiver?: IAccount;
  amount?: number;
}) {
  sender = {
    keys: [
      {
        publicKey:
          'ac76beb00875b5618744b3f734802a51eeadb4aa2f40c9e6cf410507a69831ff',
        secretKey:
          'f401a6eb1ed1bd95c902fa4bf0dfcd9a604a3b69e6aaa5b399db8e5f8591ff24',
      },
    ],
    account:
      'k:ac76beb00875b5618744b3f734802a51eeadb4aa2f40c9e6cf410507a69831ff',
    chainId: '0',
  };

  receiver = {
    keys: [
      {
        publicKey:
          '309fbd6689a99f7a6e05d9c71ad61616e0e9b922936035e87aa2a6f3588fe22f',
        secretKey:
          'a8e6276b0722c483a32c8540fbbb62fcdfe691efba4e49a113da13e2c3fff17f',
      },
    ],
    account:
      'k:309fbd6689a99f7a6e05d9c71ad61616e0e9b922936035e87aa2a6f3588fe22f',
    chainId: '0',
  };

  const transaction = Pact.builder
    .execution(
      Pact.modules['marmalade-v2.ledger']['transfer-create'](
        tokenId,
        sender.account,
        receiver.account,
        literal('(read-keyset "receiver-guard")'),
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    .addData('creator', sender.account)
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: sender.keys.map((key) => key.publicKey),
    })
    .addData('receiver-guard', {
      pred: 'keys-all',
      keys: receiver.keys.map((key) => key.publicKey),
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .setMeta({ chainId: devnetConfig.CHAIN_ID, senderAccount: sender.account })
    .addSigner(sender.keys[0].publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap(
        'marmalade-v2.ledger.TRANSFER',
        tokenId,
        sender?.account,
        receiver?.account,
        amount,
      ),
    ])
    .addSigner(sender.keys[0].publicKey)
    .createTransaction();

  console.log(transaction);

  const signedTx = signAndAssertTransaction(sender.keys)(transaction);

  console.log(await dirtyRead(transaction));

  const transactionDescriptor = await submit(signedTx);
  inspect('Transfer Submited')(transactionDescriptor);

  const result = await listen(transactionDescriptor);
  inspect('Transfer Result')(result);

  console.log(result);
}
