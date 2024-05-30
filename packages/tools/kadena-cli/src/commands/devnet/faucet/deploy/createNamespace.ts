import type { ChainId, ICommandResult } from '@kadena/client';
import {
  Pact,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import { ADMIN, ADMINS, DOMAIN, NETWORK_ID } from './constants.js';

export const createNamespace = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainId;
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

  const signWithKeyPair = createSignWithKeypair([
    {
      publicKey: ADMIN.publicKey,
      secretKey: ADMIN.secretKey,
    },
  ]);

  const signedTx = await signWithKeyPair(transaction);

  if (!isSignedTransaction(signedTx)) {
    throw new Error('Transaction is not signed');
  }

  const { submit, listen } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const requestKeys = await submit(signedTx);

  const response = await listen(requestKeys);
  return response;
};
