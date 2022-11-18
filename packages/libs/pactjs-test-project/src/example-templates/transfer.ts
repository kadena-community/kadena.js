import { signWithChainweaver } from '@kadena/client';

import mytemplates from './tx-templates';

async function main(): Promise<void> {
  const fromAcc =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const toAcc =
    'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
  const fromKey = fromAcc.split(':')[1];
  const amount = '0.321';
  const chain = '01';
  const network = 'testnet04';

  const builder = mytemplates['transfer.json']({
    fromAcct: fromAcc,
    toAcct: toAcc,
    fromKey: fromKey,
    amount,
    chain,
    network,
  });

  const signedCmd = await signWithChainweaver(builder.createCommand());
  console.log(JSON.stringify({ signedCmd }));
}

main().catch(console.error);
