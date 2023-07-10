import { Pact, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

import { local } from './util/client';

const apiHost = (
  chainId: string,
  network: string = '',
  networkId: string = 'mainnet01',
  apiVersion: string = '0.0',
): string => {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
};

const testnetChain1ApiHost: string = apiHost('1', 'testnet.', 'testnet04');

function onlyKey(account: string): string {
  return account.split(':')[1];
}

async function main(): Promise<void> {
  const sender: string =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const receiver: string = 'k:somepublickey';
  const amount: IPactDecimal = { decimal: '1000.0' };
  const data: Record<string, unknown> = {
    ks: {
      keys: ['somepublickey'],
      pred: 'keys-all',
    },
  };

  const unsignedTransaction = Pact.builder
    .execute(
      Pact.modules.coin['transfer-create'](
        sender,
        receiver,
        () => '(read-keyset "ks")',
        amount,
      ),
    )
    .addKeyset('ks', 'keys-all', 'somepublickey')
    .addSigner(onlyKey(sender), (withCapability) => [
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .setNetworkId('testnet04')
    .createTransaction();

  console.log(
    'unsigned transaction',
    JSON.stringify(unsignedTransaction, null, 2),
  );

  const localResponse = await local(unsignedTransaction);

  console.log('response: ', JSON.stringify(localResponse, null, 2));

  signWithChainweaver(unsignedTransaction)
    .then((r) =>
      console.log('signed transaction \n', JSON.stringify(r, null, 2)),
    )
    .catch(console.error);
}

main().catch(console.error);
