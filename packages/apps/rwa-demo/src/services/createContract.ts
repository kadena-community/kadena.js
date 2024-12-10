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
    .execution(getContract(data))
    .addData('ns', data.namespace)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
      gasLimit: 150000,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
