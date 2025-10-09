import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
} from '@kadena/client/fp';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

/**
 * @alpha
 */
export interface ICreatePrincipalNamespaceInput {
  keysetName: string;
  pred: 'keys-all' | 'keys-2' | 'keys-any';
  keys: string[];
  signer: string;
}

export const principalNamespaceCommand = ({
  keysetName,
  pred,
  keys,
  signer,
}: ICreatePrincipalNamespaceInput) => {
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

/**
 * @alpha
 */
export const createPrincipalNamespace = (
  inputs: ICreatePrincipalNamespaceInput,
  config: IClientConfig,
) => submitClient(config)(principalNamespaceCommand(inputs));
