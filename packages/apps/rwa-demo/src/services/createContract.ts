import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getKeyset } from '@/utils/getPubKey';
import { setSigner } from '@/utils/setSigner';
import { Pact } from '@kadena/client';
import { getContract } from './pact/modelcontract';

export interface IAddContractProps {
  contractName: string;
  namespace: string;
}

export const createContract = async (
  data: IAddContractProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
      (define-namespace (ns.create-principal-namespace (read-msg 'keyset))
        (read-msg 'keyset)
        (read-msg 'keyset)
      )
      (namespace (ns.create-principal-namespace (read-msg 'keyset)))
      (let ((keyset-name:string (format "{}.{}" [(ns.create-principal-namespace (read-msg 'keyset)) 'admin-keyset]) ))
        (define-keyset keyset-name (read-msg 'keyset))
        (enforce-keyset keyset-name)
        keyset-name
      )
      ${getContract(data)}`,
    )
    .addData('keyset', getKeyset(account))
    .addData('ns', data.namespace)
    .addData('owner_guard', getKeyset(account))
    .addData('compliance-owner', getKeyset(account))
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
      gasLimit: 150000,
    })
    .addSigner(setSigner(account), (withCap) => [])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
