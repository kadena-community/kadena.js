import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { Pact } from '@kadena/client';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';

export interface ISetComplianceProps {
  maxBalance: number;
  maxSupply: number;
}

export const setCompliance = async (
  data: ISetComplianceProps,
  network: INetwork,
  account: ConnectedAccount,
) => {
  return Pact.builder
    .execution(
      ` (RWA.max-balance-compliance.set-max-balance 60.0)
        (RWA.max-balance-compliance.set-max-supply 100.0)`,
    )
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: network.chainId,
    })
    .addSigner(ADMIN.publicKey)

    .setNetworkId(network.networkId)
    .createTransaction();
};
