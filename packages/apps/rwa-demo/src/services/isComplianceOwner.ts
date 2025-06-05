import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IIsComplianceOwnerProps {
  owner: string;
  asset: IAsset;
}

//@TODO: break this up in seperate owners:
// only checking the max-balance-compliance owner.
// not checking the supply-limit-compliance
// atm I make them the same
export const isComplianceOwner = async (data: IIsComplianceOwnerProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(max-balance-compliance-v1.is-owner (read-string 'owner))`)
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

  return result.status === 'success' ? result.data : undefined;
};
