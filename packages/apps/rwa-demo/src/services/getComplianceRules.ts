import { INFINITE_COMPLIANCE } from '@/constants';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

interface IComplianceRule {
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

export const getActiveComplianceRules = async () => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.get-compliance)`)
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  console.log('compliance', { result });

  const data = (result as any).data as any;

  return result.status === 'success' ? data : INFINITE_COMPLIANCE;
};

export const getMaxBalance = async (): Promise<number> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.max-balance-per-investor)`)
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

  return result.status === 'success' ? data : INFINITE_COMPLIANCE;
};

export const getMaxSupply = async (): Promise<number> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.supply-limit)`)
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

  return result.status === 'success' ? data : INFINITE_COMPLIANCE;
};

export const getMaxInvestors = async (): Promise<number> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.max-investors)`)
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

  return result.status === 'success' ? data : INFINITE_COMPLIANCE;
};

export const getComplianceRules = async (): Promise<IComplianceProps> => {
  const rules = await getActiveComplianceRules();
  const values = await getActiveComplianceValues();

  return {
    maxBalance: {
      isActive: !!rules.find(
        (rule: any) => rule.refName.name === 'max-balance-compliance',
      ),
      value: values['max-balance-per-investor'] ?? INFINITE_COMPLIANCE,
    },
    maxSupply: {
      isActive: !!rules.find(
        (rule: any) => rule.refName.name === 'supply-limit-compliance',
      ),
      value: values['supply-limit'] ?? INFINITE_COMPLIANCE,
    },
    maxInvestors: {
      isActive: !!rules.find(
        (rule: any) => rule.refName.name === 'max-investors-compliance',
      ),
      value: values['max-investors']?.int ?? INFINITE_COMPLIANCE,
    },
  };
};
