import path from 'node:path';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server.js';
import { services } from './services/index.js';

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'error' });
  await services.filesystem.ensureDirectoryExists(path.join(__dirname, '..'));
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
