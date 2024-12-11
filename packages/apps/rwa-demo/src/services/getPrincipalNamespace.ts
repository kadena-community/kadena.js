import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface ICreatePrincipalNamespaceProps {
  owner: IWalletAccount;
}

export const getPrincipalNamespace = async (
  data: ICreatePrincipalNamespaceProps,
) => {
  const client = getClient();

  console.log({ data });
  const transaction = Pact.builder
    .execution(
      `(namespace (ns.create-principal-namespace (read-keyset 'keyset)))`,
    )
    .addData('keyset', {
      keys: [data.owner.keyset.guard.keys[0]],
      pred: 'keys-all',
    })
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  console.log(11, { result });
  if (result.status !== 'success') return;

  const regex = /n_[a-f0-9]{40}/;
  const match = (result.data as string).match(regex);
  if (match) {
    return match[0];
  }
  console.log('No match found.');
  return;
};
