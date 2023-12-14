import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createSignWithKeypair, Pact } from '@kadena/client';
import type { transferCrossChain } from '@kadena/client-utils/coin';
import { transfer } from '@kadena/client-utils/coin';
import { crossChainClient } from '@kadena/client-utils/core';
import {
  COIN_ACCOUNT,
  DOMAIN,
  GAS_PROVIDER,
  GAS_STATION,
  NETWORK_ID,
} from './constants';

import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

const FROM = COIN_ACCOUNT;
const TO = GAS_STATION;
const AMOUNT = 9950;

export const drain = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}): Promise<any> => {
  if (NETWORK_ID !== 'testnet04') {
    return 'Only needs to happen on Testnet, funding happens differently on Devnet.';
  }

  let transaction:
    | ReturnType<typeof transferCrossChain>
    | ReturnType<typeof transfer>;

  if (chainId === '0') {
    transaction = transfer(
      {
        sender: {
          account: FROM,
          publicKeys: [GAS_PROVIDER.publicKey],
        },
        receiver: GAS_STATION,
        amount: `${AMOUNT}`,
        gasPayer: {
          account: GAS_PROVIDER.accountName,
          publicKeys: [GAS_PROVIDER.publicKey],
        },
        chainId,
      },
      {
        host: ({ networkId, chainId }) =>
          `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
        defaults: { networkId: NETWORK_ID },
        sign: createSignWithKeypair([
          {
            publicKey: GAS_PROVIDER.publicKey,
            secretKey: GAS_PROVIDER.privateKey,
          },
        ]),
      },
    );
  } else {
    // transaction = transferCrossChain(
    //   {
    //     sender: { account: COIN_ACCOUNT, publicKeys: [GAS_PROVIDER.publicKey] },
    //     receiver: {
    //       account: TO,
    //       keyset: {
    //         keys: [GAS_PROVIDER.publicKey],
    //         pred: 'keys-any',
    //       },
    //     },
    //     amount: `${AMOUNT}`,
    //     targetChainId: chainId,
    //     // targetChainGasPayer?: { account: string; publicKeys: string[] };
    //     // gasPayer?: { account: string; publicKeys: string[] };
    //     chainId: '0',
    //   },
    //   {
    //     host: ({ networkId, chainId }) =>
    //       `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    //     defaults: { networkId: NETWORK_ID },
    //     sign: createSignWithKeypair([
    //       {
    //         publicKey: GAS_PROVIDER.publicKey,
    //         secretKey: GAS_PROVIDER.privateKey,
    //       },
    //     ]),
    //   },
    // );

    transaction = crossChainClient({
      host: ({ networkId, chainId }) =>
        `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      defaults: { networkId: NETWORK_ID },
      sign: createSignWithKeypair([
        {
          publicKey: GAS_PROVIDER.publicKey,
          secretKey: GAS_PROVIDER.privateKey,
        },
      ]),
    })(chainId, {
      account: GAS_PROVIDER.accountName,
      publicKeys: [GAS_PROVIDER.publicKey],
    })(
      composePactCommand(
        execution(
          Pact.modules.coin.defpact['transfer-crosschain'](
            FROM,
            TO,
            () =>
              '(n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.create-gas-payer-guard)',
            chainId,
            {
              decimal: `${AMOUNT}`,
            },
          ),
        ),
        addSigner([GAS_PROVIDER.publicKey], (signFor) => [
          signFor(
            'coin.TRANSFER_XCHAIN',
            FROM,
            TO,
            { decimal: `${AMOUNT}` },
            chainId,
          ),
        ]),
        addSigner([GAS_PROVIDER.publicKey], (signFor) => [signFor('coin.GAS')]),
        setMeta({ senderAccount: FROM, chainId: '0' }),
      ),
    );
  }

  const result = await transaction
    .on('sign', (data) => console.log('sign', data))
    .on('preflight', (data) => console.log('preflight', data))
    .on('submit', (data) => console.log('submit', data))
    .on('listen', (data) => console.log('listen', data))
    .execute();

  return result;
};
