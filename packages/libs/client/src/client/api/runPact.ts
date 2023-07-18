import { ICommandResult, local } from '@kadena/chainweb-node-client';
import { hash as blackHash } from '@kadena/cryptography-utils';

import { composePactCommand, payload } from '../../composePactCommand';

export function runPact(
  hostUrl: string,
  code: string,
  data: Record<string, unknown>,
): Promise<ICommandResult> {
  const pactCommand = composePactCommand(payload.exec(code), {
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
