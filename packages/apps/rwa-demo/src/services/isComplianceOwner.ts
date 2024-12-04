import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IIsComplianceOwnerProps {
  owner: string;
}

export const isComplianceOwner = async (data: IIsComplianceOwnerProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(RWA.max-balance-compliance.is-compliance-owner (read-string 'owner))`,
    )
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
