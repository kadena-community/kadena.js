import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface ICreatePrincipalNamespaceProps {
  owner: IWalletAccount;
}

export const createPrincipalNamespace = async (
  data: ICreatePrincipalNamespaceProps,
) => {
  return Pact.builder
    .execution(
      `(define-namespace (ns.create-principal-namespace (read-keyset 'keyset))
    (read-keyset 'keyset)
    (read-keyset 'keyset)
  )
  (namespace (ns.create-principal-namespace (read-keyset 'keyset)))
  (let ((keyset-name:string (format "{}.{}" [(ns.create-principal-namespace (read-keyset 'keyset)) 'admin-keyset]) ))
    (define-keyset keyset-name (read-keyset 'keyset))
    (enforce-keyset keyset-name)
    keyset-name
  )`,
    )
    .addData('keyset', {
      keys: [data.owner.keyset.guard.keys[0]],
      pred: 'keys-all',
    })
    .addData('roles', [])
    .setMeta({
      senderAccount: data.owner.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(data.owner.keyset.guard.keys[0], (withCap) => [])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
