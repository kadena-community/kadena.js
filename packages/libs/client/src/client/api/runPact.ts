import type {
  ClientRequestInit,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { local } from '@kadena/chainweb-node-client';
import { hash as blackHash } from '@kadena/cryptography-utils';
import { composePactCommand, execution } from '../../composePactCommand';

export function runPact(
  hostUrl: string,
  code: string,
  data: Record<string, unknown> = {},
  requestInit?: ClientRequestInit,
): Promise<ICommandResult> {
  const pactCommand = composePactCommand(execution(code), {
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
      ...requestInit,
    },
  );
}
