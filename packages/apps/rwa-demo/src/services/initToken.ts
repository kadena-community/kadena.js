import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { Pact } from '@kadena/client';

export interface IInitTokenProps {
  name: string;
  symbol: string;
  kadenaId: string;
}

export const initToken = async (
  data: IInitTokenProps,
  network: INetwork,
  owner: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
      (RWA.agent-role.init (read-keyset 'owner_guard))
      (RWA.identity-registry.init RWA.agent-role)
      (RWA.mvp-token.init "mvp-token2" "MVP2" 0 "kadenaID2" "0.0" RWA.agent-role RWA.max-balance-compliance RWA.identity-registry false)
      (RWA.max-balance-compliance.init)
      `,
    )
    .setMeta({
      senderAccount: owner.address,
      chainId: network.chainId,
    })
    .addSigner(
      {
        pubKey: owner.keyset.guard.keys[0],
        scheme: 'WebAuthn',
      },
      (withCap) => [],
    )
    .addSigner(ADMIN.publicKey, (withCap) => [])
    .addData('owner_guard', {
      keys: [ADMIN.publicKey],
      pred: 'keys-all',
    })
    .setNetworkId(network.networkId)
    .createTransaction();
};
