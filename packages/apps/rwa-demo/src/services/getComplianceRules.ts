import { INFINITE_COMPLIANCE } from '@/constants';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export type IComplianceRuleTypes =
  | 'max-balance-compliance'
  | 'supply-limit-compliance'
  | 'max-investors-compliance';

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

export const getActiveComplianceValues = async () => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.get-compliance-parameters)`)
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

export const getActiveComplianceRules = async (asset?: string) => {
  const client = getClient();

  const innerAsset = asset ? asset : getAsset();

  if (!innerAsset) return [];

  const transaction = Pact.builder
    .execution(`(${innerAsset}.compliance)`)
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

export const getComplianceRules = async (): Promise<IComplianceProps> => {
  const rules = (await getActiveComplianceRules()) ?? [];
  const values = (await getActiveComplianceValues()) ?? {};

  return {
    maxBalance: {
      key: 'max-balance-compliance',
      isActive: !!rules?.find(
        (rule: any) => rule.refName.name === 'max-balance-compliance',
      ),
      value: values['max-balance-per-investor'] ?? INFINITE_COMPLIANCE,
    },
    maxSupply: {
      key: 'supply-limit-compliance',
      isActive: !!rules?.find(
        (rule: any) => rule.refName.name === 'supply-limit-compliance',
      ),
      value: values['supply-limit'] ?? INFINITE_COMPLIANCE,
    },
    maxInvestors: {
      key: 'max-investors-compliance',
      isActive: !!rules?.find(
        (rule: any) => rule.refName.name === 'max-investors-compliance',
      ),
      value: values['max-investors']?.int ?? INFINITE_COMPLIANCE,
    },
  };
};
