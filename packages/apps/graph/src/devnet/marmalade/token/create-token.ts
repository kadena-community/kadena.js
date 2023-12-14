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

export function destructurePolicies(policies: string[]): string {
  const policy = policies.map((policy) => `${policy}`).join(' ');
  return `${policy}`;
}

export async function createTokenId({
  policies,
  uri,
  precision = 0,
}: {
  policies: string[];
  uri: string;
  precision?: number;
}): Promise<string> {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token-id {'precision: ${precision}, 'policies: [${destructurePolicies(
        policies,
      )}], 'uri: (read-string "uri")} (read-keyset 'creation_guard))`,
    )
    .addData('uri', uri)
    .addData('creation_guard', {
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

  // const uri: string = 'https://www.kadena.io';

  // const transaction = Pact.builder
  //   .execution(
  //     Pact.modules['marmalade-v2.ledger']['create-token-id'](
  //       literal(
  //         JSON.stringify({
  //           policies: ['marmalade-v2.non-fungible-policy-v1'],
  //           uri,
  //           precision: 0,
  //         }),
  //       ),
  //       () => '(read-keyset "creation-guard")',
  //     ),
  //   )
  //   .addData('creation-guard', {
  //     pred: 'keys-all',
  //     keys: sender00.keys.map((key) => key.publicKey),
  //   })
  //   .addData('uri', uri)
  //   .setNetworkId(devnetConfig.NETWORK_ID)
  //   .setMeta({ chainId: devnetConfig.CHAIN_ID })
  //   .createTransaction();

  // console.log(transaction);
  // const result = await dirtyRead(transaction);
  // console.log(result);
}

export async function createToken({
  policies = [],
  uri,
  tokenId,
  precision = 0,
}: {
  policies?: string[];
  uri: string;
  tokenId?: string;
  precision?: number;
}): Promise<string> {
  if (!tokenId) {
    tokenId = await createTokenId({ policies, uri });
  }

  console.log(tokenId);

  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token (read-string 'token-id) 0 (read-string 'uri)[${destructurePolicies(
        policies,
      )}] (read-keyset 'creation_guard))`,
    )
    .addData('token-id', tokenId)
    .addData('uri', uri)
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
      withCap('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
        pred: 'keys-all',
        keys: sender.keys.map((key) => key.publicKey),
      }),
    ])
    .addSigner(sender.keys[0].publicKey)
    .createTransaction();

  console.log(transaction);

  const signedTx = signAndAssertTransaction(sender.keys)(transaction);

  const transactionDescriptor = await submit(signedTx);
  inspect('Transfer Submited')(transactionDescriptor);

  const result = await listen(transactionDescriptor);
  inspect('Transfer Result')(result);

  if (result.result.status === 'success') {
    console.log('Token created successfully: ', tokenId);
    return tokenId;
  } else {
    throw new Error(JSON.stringify(result.result.error));
  }
}
