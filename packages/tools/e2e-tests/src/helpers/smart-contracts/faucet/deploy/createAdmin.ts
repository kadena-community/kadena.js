import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, Pact, readKeyset } from '@kadena/client';

import {
  ADMINS,
  COIN_ACCOUNT,
  DOMAIN,
  GAS_PROVIDER,
  NETWORK_ID,
} from './constants';
import { signTransaction } from './utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createAdmin = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}) => {
  if (upgrade) {
    return 'The step "createAdmins" is skipped for upgrades';
  }

  const receiver = COIN_ACCOUNT;
  const keysetName = 'contract-admins';
  const createAdminTx = Pact.builder
    .execution(
      Pact.modules.coin['create-account'](receiver, readKeyset(keysetName)),
    )
    // .addKeyset(keysetName, 'keys-any', ADMINS.map((admin) => admin.publicKey))
    .addData(keysetName, {
      keys: ADMINS.map((admin) => admin.publicKey),
      pred: 'keys-any',
    })
    .addSigner(GAS_PROVIDER.publicKey, (withCap: any) => [withCap('coin.GAS')])
    .setMeta({
      chainId,
      gasPrice: 0.000001,
      gasLimit: 10000,
      ttl: 28800,
      creationTime: Math.round(new Date().getTime() / 1000) - 15,
      senderAccount: GAS_PROVIDER.accountName,
    })
    .setNonce('Create contract-admins')
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signTransaction(createAdminTx, {
    publicKey: GAS_PROVIDER.publicKey,
    secretKey: GAS_PROVIDER.privateKey,
  });

  const { submit, pollStatus } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const requestKeys = await submit(signedTx);

  console.log('createAdmins', requestKeys);

  return pollStatus(requestKeys);
};
