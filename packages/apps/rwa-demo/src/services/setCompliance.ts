import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { ADMIN } from '@/constants';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface ISetComplianceProps {
  maxBalance: number;
  maxSupply: number;
}

export const setCompliance = async (
  data: ISetComplianceProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      ` (RWA.max-balance-compliance.set-max-balance 60.0)
        (RWA.max-balance-compliance.set-max-supply 100.0)`,
    )
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: getNetwork().chainId,
    })
    .addSigner(ADMIN.publicKey)

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
