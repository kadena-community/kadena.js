import { signWithChainweaver } from '@kadena/client';

import mytemplates from '../tx-templates-generated';

async function main(): Promise<void> {
  const fromAcc = 'k:from';
  const toAcc = 'k:to';
  const fromKey = 'fromkey';
  const amount = '100.00';
  const chain = '01';
  const network = 'testnet04';

  const cmd = mytemplates['transfer.json']({
    fromAcct: fromAcc,
    toAcct: toAcc,
    fromKey: fromKey,
    amount,
    chain,
    network,
  });

  console.log({ cmd });

  const signedCmd = await signWithChainweaver(cmd);
  console.log({ signedCmd });
}

main().catch(console.error);
