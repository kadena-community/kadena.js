import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsOwnerProps {
  owner: string;
}

export const isOwner = async (data: IIsOwnerProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.${getAsset()}.is-owner (read-string 'owner))`)
    .setMeta({
      senderAccount: data.owner,
      chainId: getNetwork().chainId,
    })
    .addData('owner', data.owner)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  console.log({ result });
  return true;
  //TODO: fix contract
  // console.log({ result });

  // return result.status === 'success' ? result.data : undefined;
};
