import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IComplianceProps {
  maxSupply: number;
  maxBalance: number;
  maxInvestors: number;
  investorCount: number;
}

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

  return result.status === 'success' ? data : -1;
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

  return result.status === 'success' ? data : -1;
};

export const getInvestorCount = async (): Promise<number> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.investor-count)`)
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

  return result.status === 'success' ? data : -1;
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

  return result.status === 'success' ? data : -1;
};

export const getAssetMaxSupplyBalance = async (): Promise<IComplianceProps> => {
  const maxBalanceResult = await getMaxBalance();
  const maxSupplyResult = await getMaxSupply();
  const investorCount = await getInvestorCount();
  const maxInvestors = await getMaxInvestors();

  console.log({ investorCount });

  return {
    maxBalance: maxBalanceResult,
    maxSupply: maxSupplyResult,
    maxInvestors: maxInvestors,
    investorCount: investorCount,
  };
};
