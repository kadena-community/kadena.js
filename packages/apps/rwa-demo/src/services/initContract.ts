import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import type { IAddContractProps } from './createContract';

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const initContract = async (
  data: IAddContractProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(${data.namespace}.${data.contractName}.init "${data.contractName}" "MVP" 0 "kadenaID" "0.0" [RWA.max-balance-compliance RWA.supply-limit-compliance] false (keyset-ref-guard "RWA.rwa-admin-keyset"))`,
    )

    .addData('owner_guard', {
      keys: [createPubKeyFromAccount(data.owner)],
      pred: 'keys-all',
    })
    .addData('compliance-owner', {
      keys: [createPubKeyFromAccount(data.complianceOwner)],
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
