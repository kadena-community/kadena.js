import type { ChainId } from '@kadena/types';
import { expect } from '@playwright/test';
import { createUtilNamespace } from './deploy/createNamespace';
import {
  deployGaurdsContract,
  deployGuards1Contract,
} from './deploy/deployGuardsContracts';

export const deployGuards = async (chainId: ChainId) => {
  // Depends on where you're deploying, whether it's a redeploy or not (on Testnet it's not an upgrade, on (a "fresh") DevNet it is)
  const upgrade = false;
  expect(await createUtilNamespace({ chainId: chainId, upgrade })).toEqual(
    'success',
  );
  expect(
    await deployGaurdsContract({ chainId, upgrade, namespace: 'util' }),
  ).toEqual('success');
  expect(
    await deployGuards1Contract({ chainId, upgrade, namespace: 'util' }),
  ).toEqual('success');
};
