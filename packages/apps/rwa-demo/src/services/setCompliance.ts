import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface ISetComplianceProps {
  maxBalance: string;
  maxSupply: string;
}

export const setCompliance = async (
  data: ISetComplianceProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(RWA.max-balance-compliance.set-max-balance ${new PactNumber(data.maxBalance).toPactDecimal().decimal})
      (RWA.supply-limit-compliance.set-supply-limit ${new PactNumber(data.maxSupply).toPactDecimal().decimal})`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.max-balance-compliance.ONLY-OWNER`),
      withCap(`RWA.supply-limit-compliance.ONLY-OWNER`),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
