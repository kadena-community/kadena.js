import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export const getInvestorCount = async (asset?: IAsset): Promise<number> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset(asset)}.investor-count)`)
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

  return result.status === 'success' ? data.int : 0;
};
