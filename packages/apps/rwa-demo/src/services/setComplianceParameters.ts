import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { AGENTROLES } from './addAgent';

export interface ISetComplianceParametersProps {
  maxSupply: string;
  maxBalance: string;
  maxInvestors: string;
}

export const setComplianceParameters = async (
  data: ISetComplianceParametersProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
      (${getAsset()}.set-compliance-parameters (read-msg "compliance-parameters"))`,
    )
    .addData('compliance-parameters', {
      'supply-limit': new PactNumber(data.maxSupply).toPactDecimal(),
      'max-investors': new PactNumber(data.maxInvestors).toPactInteger(),
      'max-balance-per-investor': new PactNumber(
        data.maxBalance,
      ).toPactDecimal(),
    })
    .addData('agent', account.address)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`${getAsset()}.ONLY-AGENT`, AGENTROLES.AGENTADMIN),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
