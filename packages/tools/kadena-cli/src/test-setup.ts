import { vol } from 'memfs';
import path from 'node:path';

process.env.KADENA_DIR = path.join(__dirname, '..', '.kadena');
vol.mkdirSync(process.env.KADENA_DIR, { recursive: true });

import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server.js';

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'warn' });
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
