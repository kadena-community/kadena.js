import { devnetConfig } from '@devnet/config';
import {
  dirtyRead,
  inspect,
  listen,
  sender00,
  signAndAssertTransaction,
  submit,
} from '@devnet/helper';
import { Pact, literal } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

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

export async function mintToken({ tokenId }: { tokenId: string }) {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.mint (read-msg 'token-id) (read-string "creator") (read-keyset 'creator-guard) 1.0)`,
    )
    .addData('token-id', tokenId)
    .addData('creator', sender.account)
    .addData('creator-guard', {
      pred: 'keys-all',
      keys: sender.keys.map((key) => key.publicKey),
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .setMeta({
      chainId: devnetConfig.CHAIN_ID,
      senderAccount: sender.account,
    })
    .addSigner(sender.keys[0].publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('marmalade-v2.ledger.MINT', tokenId, sender.account, 1.0),
    ])
    .addSigner(sender.keys[0].publicKey)
    .createTransaction();

  const result = await dirtyRead(transaction);
  console.log(result);
}

export async function mintToken1({
  tokenId,
  precision = 0,
}: {
  tokenId: string;
  precision?: number;
}) {
  const transaction = Pact.builder
    .execution(
      Pact.modules['marmalade-v2.ledger'].mint(
        tokenId,
        sender.account,
        literal('(read-keyset "creation_guard")'),
        new PactNumber(1.0).toPactDecimal(),
      ),
    )
    .addData('token-id', tokenId)
    .addData('creator', sender.account)
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: sender.keys.map((key) => key.publicKey),
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .setMeta({
      chainId: devnetConfig.CHAIN_ID,
      senderAccount: sender.account,
    })
    .addSigner(sender.keys[0].publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('marmalade-v2.ledger.MINT', tokenId, sender.account, 1.0),
    ])
    .addSigner(sender.keys[0].publicKey)
    .createTransaction();

  console.log(transaction);

  const signedTx = signAndAssertTransaction(sender.keys)(transaction);

  const transactionDescriptor = await submit(signedTx);
  inspect('Transfer Submited')(transactionDescriptor);

  const result = await listen(transactionDescriptor);
  inspect('Transfer Result')(result);
}
