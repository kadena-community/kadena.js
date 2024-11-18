import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { Pact } from '@kadena/client';

export interface ISetComplianceProps {
  maxBalance: number;
  maxSupply: number;
}

export const setCompliance = async (
  data: ISetComplianceProps,
  network: INetwork,
  account: IWalletAccount,
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
