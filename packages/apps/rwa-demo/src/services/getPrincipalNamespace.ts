import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getClient, getNetwork } from '@/utils/client';
import { getKeyset } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export interface ICreatePrincipalNamespaceProps {
  owner: IWalletAccount;
}

export const getPrincipalNamespace = async (
  data: ICreatePrincipalNamespaceProps,
) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(ns.create-principal-namespace (read-keyset 'keyset))`)
    .addData('keyset', getKeyset(data.owner))
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

  if (resultData) return resultData;

  console.log('No match found.');
  return;
};
