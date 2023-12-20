import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';

import {
  COIN_ACCOUNT,
  DOMAIN,
  GAS_PROVIDER,
  GAS_STATION,
  NETWORK_ID,
} from './constants';
import { signTransaction } from './utils';

interface IAccount {
  chainId: ChainwebChainId;
  account: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fundAdmin = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}) => {
  if (NETWORK_ID !== 'testnet04') {
    return 'Only needs to happen on Testnet, funding happens differently on Devnet.';
  }

  if (upgrade) {
    return 'The step "fundAdmin" is skipped for upgrades';
  }

  const from: IAccount = { chainId: '0', account: COIN_ACCOUNT };
  const to: IAccount = { chainId: chainId, account: GAS_STATION };

  const fundTx = Pact.builder
    .execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        () =>
          '(n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.create-gas-payer-guard)',
        to.chainId,
        {
          decimal: `2.0`,
        },
      ),
    )
    .addSigner(GAS_PROVIDER.publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap(
        'coin.TRANSFER_XCHAIN',
        from.account,
        to.account,
        {
          decimal: `2.0`,
        },
        to.chainId,
      ),
    ])
    // .addKeyset(keysetName, 'keys-any', ...[GAS_PROVIDER.publicKey])
    .setMeta({ chainId: from.chainId, senderAccount: from.account })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signTransaction(fundTx, {
    publicKey: GAS_PROVIDER.publicKey,
    secretKey: GAS_PROVIDER.privateKey,
  });

  const { submit, listen, pollCreateSpv, pollStatus } = createClient(
    ({ chainId, networkId }) => {
      return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    },
  );

  const result = await submit(signedTx);

  const status = await listen(result);

  const proof = await pollCreateSpv(
    {
      requestKey: status.reqKey,
      networkId: NETWORK_ID,
      chainId: from.chainId,
    },
    to.chainId,
  );

  const finishTargetChainTX: IUnsignedCommand = Pact.builder
    .continuation({
      pactId: status.continuation?.pactId,
      step: 1,
      rollback: false,
      // data?: Record<string, unknown>;
      proof,
    })
    .setNetworkId(NETWORK_ID)
    // uncomment this if you want to pay gas yourself
    // .addSigner(gasPayer.publicKey, (withCapability) => [
    //   withCapability('coin.GAS'),
    // ])
    .setMeta({
      chainId: to.chainId,
      senderAccount: 'kadena-xchain-gas',
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    })
    .createTransaction();

  const finishResult = await submit(finishTargetChainTX as ICommand);

  ('fundAdmin 4', finishResult);

  return await pollStatus(finishResult);
};
