import { join } from 'node:path';
import { sortPreludes } from '.';
import type { DeployContractParams, PactToolboxClient } from '../client';
import { logger } from '../utils';
import { resolvePreludes } from './resolvePrelude';
import type { CommonPreludeOptions, PactDependency } from './types';

export async function deployPactDependency(
  dep: PactDependency,
  preludeDir: string,
  client: PactToolboxClient,
  params: DeployContractParams = {},
) {
  const { group, requires, name } = dep;
  const contractPath = join(preludeDir, group || 'root', name);
  if (Array.isArray(requires)) {
    for (const req of requires) {
      await deployPactDependency(req, preludeDir, client, params);
    }
  }
  await client.deployContract(contractPath, params);
}

export async function deployPreludes(config: CommonPreludeOptions) {
  const { preludes: resolvedPreludes } = await resolvePreludes(config);
  const sorted = sortPreludes(resolvedPreludes);
  for (const p of sorted) {
    if (await p.shouldDeploy(config.client)) {
      await p.deploy(config.client);
      logger.success(`Deployed prelude: ${p.name}`);
    }
  }
}
