import { devnetConfig } from '@devnet/config';
import { IAccount, dirtyRead } from '@devnet/helper';
import { Pact, literal } from '@kadena/client';

interface ICreateTokenId {
  policies: string[];
  uri: string;
  precision: number;
  sender: IAccount;
}

const sender = {
  keys: [
    {
      publicKey:
        'ac76beb00875b5618744b3f734802a51eeadb4aa2f40c9e6cf410507a69831ff',
      secretKey:
        'f401a6eb1ed1bd95c902fa4bf0dfcd9a604a3b69e6aaa5b399db8e5f8591ff24',
    },
  ],
  account: 'k:ac76beb00875b5618744b3f734802a51eeadb4aa2f40c9e6cf410507a69831ff',
  chainId: '0',
};

export async function createTokenId({
  policies,
  uri,
  precision,
}: ICreateTokenId): Promise<string> {
  const transaction = Pact.builder
    .execution(
      Pact.modules['marmalade-v2.ledger']['create-token-id'](
        { precision, uri, policies },
        literal('(read-keyset "creation-guard")'),
      ),
    )
    .addData('creation-guard', {
      pred: 'keys-all',
      keys: sender.keys.map((key) => key.publicKey),
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .setMeta({
      chainId: devnetConfig.CHAIN_ID,
    })
    .createTransaction();

  const command = await dirtyRead(transaction);

  if (command.result.status === 'success') {
    return command.result.data.toString();
  } else {
    throw new Error(JSON.stringify(command.result.error));
  }
}
