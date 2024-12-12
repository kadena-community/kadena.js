import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getClient, getNetwork } from '@/utils/client';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
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
      keys: [getPubkeyFromAccount(data.owner)],
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

  const resultData =
    result.status !== 'success' ? (result.error as any).message : result.data;

  const regex = /n_[a-f0-9]{40}/;
  const match = (resultData as string).match(regex);
  if (match) {
    return match[0];
  }
  console.log('No match found.');
  return;
};
