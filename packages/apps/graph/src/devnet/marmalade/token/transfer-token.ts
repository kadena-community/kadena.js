import { devnetConfig } from '@devnet/config';
import { IAccount, dirtyRead, sender00 } from '@devnet/helper';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export async function transferToken({
  tokenId,
  sender = sender00,
  receiver,
  amount = 1,
}: {
  tokenId: string;
  sender?: IAccount;
  receiver?: IAccount;
  amount?: number;
}) {
  receiver = {
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

  const transaction = Pact.builder
    .execution(
      Pact.modules['marmalade-v2.ledger'].transfer(
        tokenId,
        sender.account,
        receiver.account,
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    .setNetworkId(devnetConfig.NETWORK_ID)
    .setMeta({ chainId: devnetConfig.CHAIN_ID })
    .createTransaction();

  console.log(transaction);

  const result = await dirtyRead(transaction);
  console.log(result);
}
