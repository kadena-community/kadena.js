import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsOwnerProps {
  account: IWalletAccount;
  asset: IAsset;
}

export const isOwner = async ({ account, asset }: IIsOwnerProps) => {
  const client = getClient();
  const transaction = Pact.builder
    .execution(
      ` (describe-keyset (drop 1 (format "{}" [(${getAsset(asset)}.get-owner-guard)])))`,
    )
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .addData('owner', account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return !!(result as any).data.keys.find(
    (k: string) => account.publicKey === k,
  );
};
