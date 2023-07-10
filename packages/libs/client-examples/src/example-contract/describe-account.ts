import { ICommandResult, Pact } from '@kadena/client';

import { local, pollStatus } from './util/client';

async function transactionMain(): Promise<void> {
  const senderAccount: string =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

  const unsignedTransaction = Pact.builder
    .execute(Pact.modules.coin.details(senderAccount))
    .createTransaction();

  const res = await local(unsignedTransaction);
  console.log(res);
}

async function pollMain(
  ...requestKeys: string[]
): Promise<Record<string, ICommandResult>> {
  if (requestKeys.length === 0) {
    console.log('function called without arguments');
    throw new Error('NO_KEY');
  }

  const pollResponse = await pollStatus(requestKeys, {
    onPoll: (key) => {
      console.log(`polling for ${key}`);
    },
  });

  return pollResponse;
}

async function getBalanceMain() {
  const tr = Pact.builder
    .execute(
      Pact.modules.coin['get-balance'](
        'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
      ),
    )
    .setMeta({ sender: '', chainId: '10' })
    .setNetworkId('mainnet04')
    .createTransaction();

  const res = await local(tr);

  console.log(res);
}

transactionMain().catch(console.error);
