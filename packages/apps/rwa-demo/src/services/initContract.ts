import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';
import type { IAddContractProps } from './createContract';

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const initContract = async (
  data: IAddContractProps,
  account: IWalletAccount,
) => {
  const keysetname = `${data.namespace}.admin-keyset`;

  return Pact.builder
    .execution(
      `
      (${data.namespace}.${data.contractName}.init "${data.contractName}" "MVP" 0 "kadenaID" "0.0" [RWA.max-balance-compliance RWA.supply-limit-compliance] false (keyset-ref-guard (read-msg 'keyset-name)))`,
    )
    .addData('ns', data.namespace)
    .addData('keyset-name', keysetname)
    .addData('ks', {
      keys: [createPubKeyFromAccount(data.owner)],
      pred: 'keys-all',
    })
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

    .addSigner(account.keyset.guard.keys[0], (withCap) => [])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
