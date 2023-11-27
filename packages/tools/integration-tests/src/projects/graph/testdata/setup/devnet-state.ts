import { beforeAll } from 'vitest'
import { simulate } from '../devnet/simulation/simulate';



beforeAll(async () => {
  await simulate({numberOfAccounts: 2, transferInterval: 100, maxAmount: 25, tokenPool: 1000000, seed: Date.now().toString(), duration: 10000, maxTransfers: 2})
}, 120000)
