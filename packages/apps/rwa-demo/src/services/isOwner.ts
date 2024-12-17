import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsOwnerProps {
  owner: string;
}

export const isOwner = async (data: IIsOwnerProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(describe-keyset (${getAsset()}.get-owner-guard))`)
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

  console.log(22, { result });
  return true;
  //TODO: fix contract
  // return result.status === 'success' ? result.data : undefined;
};
