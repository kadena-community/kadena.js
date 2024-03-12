import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ICommand } from '@kadena/client';
import { Pact, createClient, createSignWithKeypair } from '@kadena/client';
import { sender00Account } from '../../../constants/accounts.constants';
import { devnetUrl, networkId } from '../../../constants/network.constants';

export const createUtilNamespace = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}): Promise<string> => {
  //TODO: Check if namespace exists before creating.
  if (upgrade) {
    return 'The step "createNamespace" is skipped for upgrades';
  }

  const pactCommand = `
    (ns.write-registry 'util (read-keyset 'util-ns-admin) true)
    (define-namespace 'util (read-keyset 'util-ns-admin)(read-keyset 'util-ns-admin))
    (namespace 'util)
    (define-keyset "util.util-ns-admin" (read-keyset 'util-ns-admin))
    (define-keyset "util.util-ns-users" (read-keyset 'util-ns-admin))
  `;

  const transaction = Pact.builder
    .execution(pactCommand)
    .addKeyset('util-ns-admin', 'keys-any', sender00Account.keys[0].publicKey)
    .addSigner(sender00Account.keys[0].publicKey)
    .setMeta({
      chainId,
      senderAccount: sender00Account.account,
    })
    .setNetworkId(networkId)
    .createTransaction();

  const signWithKeypair = createSignWithKeypair([sender00Account.keys[0]]);
  const signedTx = await signWithKeypair(transaction);

  const { submit, listen } = createClient(devnetUrl(chainId));

  const requestKeys = await submit(signedTx as ICommand);
  const response = await listen(requestKeys);
  return response.result.status;
};
