import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, Pact } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

import {
  ADMINS,
  DOMAIN,
  GAS_PROVIDER,
  InitialFunding,
  NETWORK_ID,
} from './constants';
import { signTransaction } from './utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fundFaucet = async ({ chainId }: { chainId: ChainwebChainId }) => {
  const sender = 'sender00';
  const receiverA = 'coin-faucet';
  const receiverB = 'faucet-operation';

  const amountA: IPactDecimal = { decimal: `${InitialFunding.COIN_FAUCET}.0` };
  const amountB: IPactDecimal = {
    decimal: `${InitialFunding.FAUCET_OPERATION}.0`,
  };

  const operationKeyset = 'operation-keyset';

  const fundTx = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender,
        receiverA,
        () => '(user.coin-faucet.faucet-guard)',
        amountA,
      ),
      Pact.modules.coin['transfer-create'](
        sender,
        receiverB,
        () => `(read-keyset "${operationKeyset}")`,
        amountB,
      ),
    )
    .addData(operationKeyset, {
      keys: ADMINS.map((admin) => admin.publicKey),
      pred: 'keys-any',
    })
    .addSigner(GAS_PROVIDER.publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', sender, receiverA, amountA),
      withCap('coin.TRANSFER', sender, receiverB, amountB),
    ])
    .setMeta({
      chainId,
      gasPrice: 0.000001,
      gasLimit: 10000,
      ttl: 28800,
      creationTime: Math.round(new Date().getTime() / 1000) - 15,
      senderAccount: sender,
    })
    .setNonce('Create accounts for Faucet')
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signTransaction(fundTx, {
    publicKey: GAS_PROVIDER.publicKey,
    secretKey: GAS_PROVIDER.privateKey,
  });

  const { submit, listen } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const requestKeys = await submit(signedTx);

  console.log('fundFaucet', requestKeys);

  const response = await listen(requestKeys);
  return response.result.status;
};
