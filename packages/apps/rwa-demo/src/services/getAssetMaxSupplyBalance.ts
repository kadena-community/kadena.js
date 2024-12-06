import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IGetAssetMaxSupplyBalanceResult {
  maxSupply: number;
  maxBalance: number;
}

export const getAssetMaxSupplyBalance =
  async (): Promise<IGetAssetMaxSupplyBalanceResult> => {
    const client = getClient();

    const transaction = Pact.builder
      .execution(`(RWA.max-balance-compliance.get-max-balance-max-supply)`)
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

    return result.status === 'success'
      ? ({
          maxBalance: data['max-balance-per-investor'],
          maxSupply: data['max-supply'],
        } as IGetAssetMaxSupplyBalanceResult)
      : { maxBalance: -1, maxSupply: -1 };
  };
