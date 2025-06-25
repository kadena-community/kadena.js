import { INFINITE_COMPLIANCE } from '@/constants';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export type IComplianceRuleTypes =
  | 'max-balance-compliance-v1'
  | 'supply-limit-compliance-v1'
  | 'max-investors-compliance-v1';

export interface IComplianceRule {
  key: IComplianceRuleTypes;
  isActive: boolean;
  value: number;
}
export interface IComplianceProps {
  maxSupply: IComplianceRule;
  maxBalance: IComplianceRule;
  maxInvestors: IComplianceRule;
}

export const getActiveComplianceValues = async (asset: IAsset) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset(asset)}.get-compliance-parameters)`)
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  const data = (result as any).data as any;

  return result.status === 'success' ? data : undefined;
};

export const getActiveComplianceRules = async (assetName: string) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${assetName}.compliance)`)
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  const data = (result as any).data as any;

  return result.status === 'success' ? data : [];
};

export const getComplianceRules = async (
  asset: IAsset,
): Promise<IComplianceProps> => {
  const rules = (await getActiveComplianceRules(getAsset(asset))) ?? [];
  const values = (await getActiveComplianceValues(asset)) ?? {};

  return {
    maxBalance: {
      key: 'max-balance-compliance-v1',
      isActive: !!rules?.find(
        (rule: any) => rule.refName.name === 'max-balance-compliance-v1',
      ),
      value: values['max-balance-per-investor'] ?? INFINITE_COMPLIANCE,
    },
    maxSupply: {
      key: 'supply-limit-compliance-v1',
      isActive: !!rules?.find(
        (rule: any) => rule.refName.name === 'supply-limit-compliance-v1',
      ),
      value: values['supply-limit'] ?? INFINITE_COMPLIANCE,
    },
    maxInvestors: {
      key: 'max-investors-compliance-v1',
      isActive: !!rules?.find(
        (rule: any) => rule.refName.name === 'max-investors-compliance-v1',
      ),
      value: values['max-investors']?.int ?? INFINITE_COMPLIANCE,
    },
  };
};
