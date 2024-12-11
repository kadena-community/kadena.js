import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';
import { getContract } from './pact/modalcontract';

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
      keys: [account.keyset.guard.keys[0]],
      pred: 'keys-all',
    })
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
      gasLimit: 150000,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
