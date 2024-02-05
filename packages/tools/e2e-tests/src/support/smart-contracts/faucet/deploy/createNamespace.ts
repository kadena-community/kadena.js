import { sender00Account } from '@constants/accounts.constants';
import { devnetUrl, networkId } from '@constants/network.constants';
import type {
  ChainwebChainId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import type { ICommand } from '@kadena/client';
import { Pact, createClient, createSignWithKeypair } from '@kadena/client';

export const createNamespace = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}): Promise<ICommandResult | string> => {
  if (upgrade) {
    return 'The step "createNamespace" is skipped for upgrades';
  }

  const keysetName = 'admin-keyset';
  const pactCommand = `
    (let ((ns-name (ns.create-principal-namespace (read-keyset '${keysetName}))))
      (define-namespace
        ns-name
        (read-keyset '${keysetName} )
        (read-keyset '${keysetName} )
      )
      (namespace ns-name)
      (define-keyset
        (format "{}.{}"
          [ns-name '${keysetName}]
        )
        (read-keyset '${keysetName})
      )
    )
  `;

  const transaction = Pact.builder
    .execution(pactCommand)
    .addKeyset(keysetName, 'keys-any', sender00Account.keys[0].publicKey)
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

  // const transactionDescriptor = await client.submit(signedTx);
  const response = await listen(requestKeys);
  // if (response.result.status === 'failure') {
  //   throw response.result.error;
  // } else {
  //   return response.result;
  // }
  return response;

  // return await pollStatus(requestKeys);
};
