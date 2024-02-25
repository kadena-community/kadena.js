import type { PactToolboxConfigObj } from '../config';
import { resolveConfig } from '../config';
import { PactToolboxClient } from './client';

export async function createPactClient(config?: PactToolboxConfigObj) {
  if (!config && process.env.__PACT_TOOLBOX_CONFIG__) {
    config = JSON.parse(process.env.__PACT_TOOLBOX_CONFIG__);
  }

  if (!config) {
    config = await resolveConfig();
  }

  return new PactToolboxClient(config);
}
