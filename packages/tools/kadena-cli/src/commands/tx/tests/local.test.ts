import type { ICommandPayload } from '@kadena/types';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../../mocks/server.js';
import { safeJsonParse } from '../../../utils/globalHelpers.js';
import { runCommand } from '../../../utils/test.util.js';

const getCommand = (body: string): ICommandPayload | null => {
  const json = safeJsonParse(body);
  const cmd =
    json !== null && typeof json === 'object' && 'cmd' in json
      ? (json.cmd as string)
      : null;
  return cmd !== null ? safeJsonParse<ICommandPayload>(cmd) : null;
};

describe('tx local', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it('Submits a valid transaction and receives success response', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/local',
        async (req): Promise<HttpResponse> => {
          const cmd = getCommand(await req.request.text());
          if (
            cmd &&
            'exec' in cmd.payload &&
            cmd.payload.exec.code === '(+ 1 1)'
          ) {
            return HttpResponse.json({
              result: { status: 'success', data: 2 },
            });
          } else {
            return HttpResponse.json(
              { result: { status: 'failure', error: { message: 'error' } } },
              { status: 400 },
            );
          }
        },
      ),
    );
    const { stdout } = await runCommand(['tx', 'local', '(+ 1 1)']);
    expect(stdout).toBe('2');
  });
});
