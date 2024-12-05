import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
} from '@kadena/client/fp';

export const principalNamespaceCommand = ({
  keysetName,
  pred,
  keys,
  signer,
}: {
  keysetName: string;
  pred: string;
  keys: string[];
  signer: string;
}) => {
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
      ns-name
    )
  `;

  const command = composePactCommand(
    execution(pactCommand),
    addKeyset(keysetName, pred, ...keys),
    addSigner(signer),
  );

  return command();
};
