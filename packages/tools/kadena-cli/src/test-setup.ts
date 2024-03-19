import { vol } from 'memfs';
import path from 'node:path';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server.js';

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'error' });
  await vol.promises.mkdir(path.join(__dirname, '..'), { recursive: true });
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
