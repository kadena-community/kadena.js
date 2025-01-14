import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsOwnerProps {
  owner: string;
}

export const isOwner = async (data: IIsOwnerProps) => {
  const client = getClient();
  const transaction = Pact.builder
    .execution(
      ` (describe-keyset (drop 1 (format "{}" [(${getAsset()}.get-owner-guard)])))`,
    )
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .addData('owner', data.owner)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return !!(result as any).data.keys.find((k: string) =>
    data.owner.includes(k),
  );
};
