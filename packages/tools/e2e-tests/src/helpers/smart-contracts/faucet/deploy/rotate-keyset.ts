import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, Pact, readKeyset } from '@kadena/client';

import { ADMINS, DOMAIN, GAS_PROVIDER, NETWORK_ID } from './constants';
import { signTransaction } from './utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const rotateKeyset = async (
  account: string,
  chainId: ChainwebChainId,
) => {
  const newKeyset = 'new-keyset';
  const rotateTx = Pact.builder
    .execution(Pact.modules.coin.rotate(account, readKeyset(newKeyset)))
    .addKeyset(newKeyset, 'keys-any', ...ADMINS.map((a) => a.publicKey))
    .addSigner(GAS_PROVIDER.publicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.ROTATE', account),
    ])
    .setMeta({ chainId, senderAccount: GAS_PROVIDER.accountName })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const { submit, pollStatus } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const signedTx = signTransaction(rotateTx, {
    secretKey: GAS_PROVIDER.privateKey,
    publicKey: GAS_PROVIDER.publicKey,
  });

  const requestKeys = await submit(signedTx);

  console.log('rotateKeyset', requestKeys);

  return await pollStatus(requestKeys);
};
