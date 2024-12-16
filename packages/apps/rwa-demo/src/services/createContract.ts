import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { getContract } from './pact/modelcontract';

export interface IAddContractProps {
  contractName: string;
  owner: string;
  complianceOwner: string;
  namespace: string;
}

export const createContract = async (
  data: IAddContractProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
      (define-namespace (ns.create-principal-namespace (read-keyset 'keyset))
        (read-keyset 'keyset)
        (read-keyset 'keyset)
      )
      (namespace (ns.create-principal-namespace (read-keyset 'keyset)))
      (let ((keyset-name:string (format "{}.{}" [(ns.create-principal-namespace (read-keyset 'keyset)) 'admin-keyset]) ))
        (define-keyset keyset-name (read-keyset 'keyset))
        (enforce-keyset keyset-name)
        keyset-name
      )
      ${getContract(data)}`,
    )
    .addData('ns', data.namespace)
    .addData('keyset', {
      keys: [getPubkeyFromAccount(account)],
      pred: 'keys-all',
    })
    .addData('owner_guard', {
      keys: [getPubkeyFromAccount(account)],
      pred: 'keys-all',
    })
    .addData('compliance-owner', {
      keys: [getPubkeyFromAccount(account)],
      pred: 'keys-all',
    })
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
      gasLimit: 150000,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
