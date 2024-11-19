import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface ISetComplianceProps {
  maxBalance: number;
  maxSupply: number;
}

export const setCompliance = async (
  data: ISetComplianceProps,
  account: IWalletAccount,
) => {
  console.log(data.maxBalance, new PactNumber(data.maxBalance).toPactDecimal());
  return Pact.builder
    .execution(
      ` (RWA.max-balance-compliance.set-max-balance ${new PactNumber(data.maxBalance).toPactDecimal().decimal})
        (RWA.max-balance-compliance.set-max-supply ${new PactNumber(data.maxSupply).toPactDecimal().decimal})`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
