import {
  IAccount,
  inspect,
  listen,
  sender00,
  signAndAssertTransaction,
  submit,
} from '@devnet/helper';
import {
  ICommandResult,
  Pact,
  PactReference,
  createSignWithKeypair,
  literal,
  readKeyset,
} from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import {
  addData,
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { dotenv } from '@utils/dotenv';
import { createTokenId } from './create-token-id';

interface ICreateTokenInput {
  policies?: string[];
  uri: string;
  tokenId?: string;
  precision?: number;
  sender: IAccount;
}

export async function createToken({
  policies = [],
  uri,
  tokenId,
  precision = 0,
  sender,
}: ICreateTokenInput): Promise<ICommandResult> {
  if (!tokenId) {
    tokenId = await createTokenId({ policies, uri, sender });
  }

  console.log('Token ID: ', tokenId);

  const command = composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['create-token'](
        tokenId,
        new PactNumber(precision).toPactInteger(),
        uri,
        //@ts-ignore
        Array(policies.join(' ')),
        readKeyset('creation-guard'),
      ),
    ),
    addKeyset(
      'creation-guard',
      'keys-all',
      ...sender.keys.map((key) => key.publicKey),
    ),
    addSigner(
      sender.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor(
          'marmalade-v2.ledger.CREATE-TOKEN',
          tokenId,
          new PactNumber(precision).toPactInteger(),
          uri,
          literal(policies.join(' ')),
        ),
      ],
    ),
    addSigner(sender.keys.map((key) => key.publicKey)),
    setMeta({ senderAccount: sender.account, chainId: sender.chainId }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
    sign: createSignWithKeypair(sender.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  console.log(result);
  return result;
}

export async function createToken1({
  policies = [],
  uri,
  tokenId,
  precision = 0,
  sender,
}: ICreateTokenInput): Promise<string> {
  if (!tokenId) {
    tokenId = await createTokenId({ policies, uri, sender });
  }

  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token (read-string 'token-id) 0 (read-string 'uri) [${policies.join(
        ' ',
      )}] (read-keyset 'creation_guard))`,
    )
    .addData('token-id', tokenId)
    .addData('uri', uri)
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: sender.keys.map((key) => key.publicKey),
    })

    .setNetworkId(dotenv.NETWORK_ID)
    .setMeta({
      chainId: sender.chainId,
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
