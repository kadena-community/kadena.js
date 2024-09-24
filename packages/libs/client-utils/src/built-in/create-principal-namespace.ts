import { addKeyset, composePactCommand, execution } from '@kadena/client/fp';

export const principalNamespaceCommand = (
  keysetName: string,
  pred: string,
  keys: string[],
) => {
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

  const command = composePactCommand(
    execution(pactCommand),
    addKeyset(keysetName, pred, ...keys),
  );

  return command();
};
