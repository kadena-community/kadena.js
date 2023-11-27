import { beforeAll } from 'vitest';
import { simulate } from '../devnet/simulation/simulate';

beforeAll(async () => {
  await simulate({
    numberOfAccounts: 2,
    transferInterval: 50,
    maxAmount: 25,
    tokenPool: 1000000,
    seed: Date.now().toString(),
    duration: 5000,
    maxTransfers: 1,
  });
}, 60000);
