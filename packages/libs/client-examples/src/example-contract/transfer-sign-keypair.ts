import { isSignedTransaction, Pact, signWithChainweaver } from '@kadena/client';
import type { IPactDecimal } from '@kadena/types';

import { listen, submit } from './util/client';
import { keyFromAccount } from './util/keyFromAccount';

// npx ts-node transfer-sign-keypair.ts

const accountA = {
  account: 'k:df97119a753e51b0d056ec307998f80bb0a940d78d82a4f119b29c670ea40e6a',
  public: 'df97119a753e51b0d056ec307998f80bb0a940d78d82a4f119b29c670ea40e6a',
  secret: '42373560ef2ef36aa5944d83f1552c736cff7ba6b021c1e155c13bee0c7fa202',
};

const accountB = {
  account: 'k:2958b2d4258479472ca1e65e3c8c16faff7389aa337728a72f5c1cc3ffacd75d',
  public: '2958b2d4258479472ca1e65e3c8c16faff7389aa337728a72f5c1cc3ffacd75d',
  secret: 'b1c9ff9b3cf70901641da03673a0ce05c0aaaeeea333e65f202c08dd09890446',
};

const NETWORK_ID: string = 'testnet04';

module.exports = {
  faucetOpKP: {
    publicKey: "dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e",
    secretKey: "49a1e8f8ef0a8ca6bd1d5f3a3e45f10aa1dd987f2cfb94e248a457c178f347b4"
  },
  devnetKp : {
    publicKey: '6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7',
    secretKey: '2beae45b29e850e6b1882ae245b0bab7d0689ebdd0cd777d4314d24d7024b4f7'
  },
  devnetAcct: "sender01",
  faucetOpAcct: "faucet-operation",
  faucetAcct: "coin-faucet"
}

const fundAccount = async function fundAccount(
  fundAccount: { account: string, public: string; secret: string },
) {

  const transaction = Pact.builder
  .execution(
    Pact.modules['user.coin-faucet']['create-and-request-coin'](
      account,
      // TODO: guard
      new PactNumber(amount).toPactDecimal(),
    ),
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .addSigner(FAUCET_PUBLIC_KEY, (withCap: any) => [withCap('coin.GAS')])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .addSigner(keyPair.publicKey, (withCap: any) => [
    withCap(
      'coin.TRANSFER',
      SENDER_ACCOUNT,
      account,
      new PactNumber(amount).toPactDecimal(),
    ),
  ])
  .setMeta({ senderAccount: SENDER_OPERATION_ACCOUNT, chainId })
  .setNetworkId(NETWORK_ID)
  .createTransaction();

const signature1 = sign(transaction.cmd, {
  publicKey: FAUCET_PUBLIC_KEY,
  secretKey: FAUCET_PRIVATE_KEY,
});
})

async function transfer(
  senderUser: { account: string, public: string; secret: string },
  receiverUser: { account:string, public: string; secret: string },
  amount: IPactDecimal,
): Promise<void> {
  const sender = senderUser.account;
  const receiver = receiverUser.account;

  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(keyFromAccount(sender), (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  console.log('transaction', JSON.parse(transaction.cmd));

  const signedTr = await signWithChainweaver(transaction);
  console.log('transation.sigs', JSON.stringify(signedTr.sigs, null, 2));

  if (isSignedTransaction(signedTr)) {
    const transactionDescriptor = await submit(signedTr);
    const response = await listen(transactionDescriptor);
    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log(response.result);
    }
  }
}

transfer(accountA, accountB, { decimal: '1' }).catch(console.error);
