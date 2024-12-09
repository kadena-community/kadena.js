import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IGetAssetMaxSupplyBalanceResult {
  maxSupply: number;
  maxBalance: number;
}

export const getAssetMaxSupplyBalance =
  async (): Promise<IGetAssetMaxSupplyBalanceResult> => {
    const maxBalanceResult = await getMaxBalance();
    const maxSupplyResult = await getMaxSupply();

    return {
      maxBalance: maxBalanceResult,
      maxSupply: maxSupplyResult,
    };
  };

export const getMaxBalance = async (): Promise<number> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.max-balance-compliance.get-max-balance)`)
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
    .execution(`(RWA.supply-limit-compliance.get-supply-limit)`)
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
