import { IPactDecimal } from '@kadena/types';
import { Pact, isSignedTransaction, readKeyset } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { sign } from '@kadena/cryptography-utils';
import { pollStatus, submit } from './client';

type User = {
  account: string;
  publicKey: string;
  secretKey: string;
};

const FAUCET = {
  publicKey: 'FAUCET_PUBLIC_KEY',
  secretKey: 'FAUCET_PRIVATE_KEY',
};
const NETWORK_ID = 'fast-development';
const SENDER_ACCOUNT: string = 'coin-faucet';
const SENDER_OPERATION_ACCOUNT: string = 'faucet-operation';
const CHAIN_ID = '1';

async function fundAccount(account: User, amount = 100) {
  const transaction = Pact.builder
    .execution(
      Pact.modules['user.coin-faucet']['create-and-request-coin'](
        account.account,
        readKeyset('ks'),
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(FAUCET.publicKey, (withCap: any) => [withCap('coin.GAS')])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(account.publicKey, (withCap: any) => [
      withCap(
        'coin.TRANSFER',
        SENDER_ACCOUNT,
        account,
        new PactNumber(amount).toPactDecimal(),
      ),
    ])
    .setMeta({ senderAccount: SENDER_OPERATION_ACCOUNT, chainId: CHAIN_ID })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signature1 = sign(transaction.cmd, FAUCET);

  const signature2 = sign(transaction.cmd, account);

  if (signature2.sig === undefined || signature1.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  transaction.sigs = [{ sig: signature1.sig }, { sig: signature2.sig }];

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const requestKeys = await submit(transaction);

  return await pollStatus(requestKeys);
}
