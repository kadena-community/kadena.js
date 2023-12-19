import type {
  ChainwebChainId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { Pact, createClient } from '@kadena/client';
import { ADMIN, ADMINS, DOMAIN, NETWORK_ID } from './constants';
import { signTransaction } from './utils';

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
    .addKeyset(
      keysetName,
      'keys-any',
      ...ADMINS.map((admin) => admin.publicKey),
    )
    .addSigner(ADMIN.publicKey)
    .setMeta({
      chainId,
      senderAccount: ADMIN.accountName,
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signTransaction(transaction, {
    publicKey: ADMIN.publicKey,
    secretKey: ADMIN.privateKey,
  });

  const { submit, listen } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const requestKeys = await submit(signedTx);

  // const transactionDescriptor = await client.submit(signedTx);
  const response = await listen(requestKeys);
  // if (response.result.status === 'failure') {
  //   throw response.result.error;
  // } else {
  //   console.log(response.result);
  //   return response.result;
  // }
  return response;

  // return await pollStatus(requestKeys);
};
