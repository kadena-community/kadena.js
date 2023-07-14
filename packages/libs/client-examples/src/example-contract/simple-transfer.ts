import { isSignedCommand, Pact, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

import { pollStatus, submit } from './util/client';
import { keyFromAccount } from './util/keyFromAccount';

async function transfer(
  sender: string,
  receiver: string,
  amount: IPactDecimal,
): Promise<void> {
  const transaction = Pact.builder
    .execute(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(keyFromAccount(sender), (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .setMeta({ chainId: '1', sender: keyFromAccount(sender) })
    .setNetworkId("testnet04'")
    .createTransaction();

  const signedTr = await signWithChainweaver(transaction);
  console.log('transation.sigs', JSON.stringify(signedTr.sigs, null, 2));

  if (isSignedCommand(signedTr)) {
    const requestKeys = await submit(signedTr);
    const result = pollStatus(requestKeys);
    console.log(result);
  }
}

const myAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
const receiver: string = 'albert';

transfer(myAccount, receiver, { decimal: '10' }).catch(console.error);
