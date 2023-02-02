import { IPactCommand, Pact, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

const sender: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
const receiver: string =
  'k:78d6627434349489952f909c389ea87d7f74b6f58d7ac1ed0f676309d9c56fb8';
const amount: IPactDecimal = { decimal: '5.5' };
const pactCommand: IPactCommand &
  ReturnType<typeof Pact.modules.coin.transfer> = Pact.modules.coin
  .transfer(sender, receiver, amount)
  .addCap('coin.GAS', sender.split('k:')[1])
  .addCap('coin.TRANSFER', sender.split('k:')[1], sender, receiver, amount)
  .setMeta(
    {
      chainId: '1',
      gasLimit: 600,
      gasPrice: 1.0e-8,
      sender: sender.split('k:')[1],
      ttl: 10 * 60, // 10 minutes
    },
    'testnet04',
  );

// let's sign with chainweaver quicksign
signWithChainweaver(pactCommand).then(console.log).catch(console.error);
