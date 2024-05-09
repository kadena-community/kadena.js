import { vol } from 'memfs';
import path from 'node:path';

process.env.KADENA_DIR = path.join(__dirname, '..', '.kadena');
vol.mkdirSync(process.env.KADENA_DIR, { recursive: true });

import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server.js';

beforeAll(async () => {
  const { ensureNetworksConfiguration } = await import(
    './networks/utils/networkHelpers.js'
  );
  const { writeTemplatesToDisk } = await import(
    './tx/commands/templates/templates.js'
  );
  await ensureNetworksConfiguration(process.env.KADENA_DIR!);
  await writeTemplatesToDisk();

  server.listen({ onUnhandledRequest: 'warn' });
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
