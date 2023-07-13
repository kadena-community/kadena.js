import { ICommandResult, local } from '@kadena/chainweb-node-client';
import { hash as blackHash } from '@kadena/cryptography-utils';

import { createPactCommand, payload } from '../../createPactCommand';

export function runPact(
  hostUrl: string,
  code: string,
  data: Record<string, unknown>,
): Promise<ICommandResult> {
  const pactCommand = createPactCommand(payload.exec(code), {
    payload: { exec: { data } },
  })();

  const cmd = JSON.stringify(pactCommand);
  return local(
    {
      cmd,
      hash: blackHash(cmd),
      sigs: [],
    },
    hostUrl,
    {
      preflight: false,
      signatureVerification: false,
    },
  );
}
