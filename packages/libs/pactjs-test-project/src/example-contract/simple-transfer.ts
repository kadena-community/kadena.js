import { Pact, signWithChainweaver } from '@kadena/client';

import { testnetChain1ApiHost } from './util/host';
import { keyFromAccount } from './util/keyFromAccount';

async function transfer(
  sender: string,
  receiver: string,
  amount: number,
  host: string,
): Promise<void> {
  const builder = Pact.modules.coin
    .transfer(sender, receiver, amount)
    .addCap('coin.GAS', keyFromAccount(sender))
    .addCap('coin.TRANSFER', keyFromAccount(sender), sender, receiver, amount)
    .setMeta({ sender: keyFromAccount(sender) }, 'testnet04');

  console.log('SigData', JSON.stringify(builder.createCommand().cmd));

  // or use signWithChainweaver
  const signatures = await signWithChainweaver(builder);
  console.log('transation.sigs', JSON.stringify(signatures[0].sigs, null, 2));

  // once signed we can send it to the blockchain
}

const myAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
const receiver: string = 'albert';

transfer(myAccount, receiver, 10.0, testnetChain1ApiHost).catch(console.error);
