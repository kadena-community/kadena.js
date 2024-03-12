import { join } from 'node:path';
import type {
  DeployContractParams,
  PactToolboxClient,
} from '../../../../client';
import type { KeysetConfig } from '../../../../config';
import { logger } from '../../../../utils';
import { deployPactDependency } from '../../../deployPrelude';
import type { PactDependency, PactPrelude } from '../../../types';
import { preludeSpec, renderTemplate } from '../../../utils';

function chainWebPath(path: string) {
  return `gh:kadena-io/chainweb-node/pact/${path}#master`;
}

const chainWebSpec: Record<string, PactDependency[]> = {
  root: [
    preludeSpec('ns.pact', chainWebPath('namespaces/v1/ns.pact')),
    preludeSpec(
      'gas-payer-v1.pact',
      chainWebPath('gas-payer/gas-payer-v1.pact'),
    ),
    preludeSpec(
      'fungible-v2.pact',
      chainWebPath('coin-contract/v2/fungible-v2.pact'),
    ),
    preludeSpec(
      'fungible-xchain-v1.pact',
      chainWebPath('coin-contract/v4/fungible-xchain-v1.pact'),
    ),
    preludeSpec(
      'coin-v6.pact',
      chainWebPath('coin-contract/v6/coin-v6-install.pact'),
    ),
  ],
  util: [
    preludeSpec('util-ns.pact', chainWebPath('util/util-ns.pact'), 'util'),
    preludeSpec('guards.pact', chainWebPath('util/guards.pact'), 'util'),
  ],
};

export default {
  name: 'kadena/chainweb',
  specs: chainWebSpec,
  async shouldDeploy(client: PactToolboxClient) {
    if (client.isChainwebNetwork()) {
      return false;
    }
    if (await client.isContractDeployed('coin')) {
      return false;
    }
    return true;
  },
  async repl(client: PactToolboxClient) {
    const keys = client.getSigner();
    const context = {
      publicKey: keys.publicKey,
    };
    const installTemplate = (await import('./install.handlebars')).template;
    return renderTemplate(installTemplate, context);
  },
  async deploy(client: PactToolboxClient, params: DeployContractParams = {}) {
    const { signer } = params;
    const keys = client.getSigner(signer);
    const rootKeysets = {
      'ns-admin-keyset': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
      'ns-operate-keyset': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
      'ns-genesis-keyset': { keys: [], pred: '=' },
    } as Record<string, KeysetConfig>;

    const utilKeysets = {
      'util-ns-users': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
      'util-ns-admin': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
    } as Record<string, KeysetConfig>;
    const preludeDir = join(client.getPreludeDir(), 'kadena/chainweb');
    // deploy root prelude
    for (const dep of chainWebSpec.root) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        keysets: rootKeysets,
        signer: signer,
      });
      logger.success(`Deployed ${dep.name}`);
    }
    // deploy util prelude
    for (const dep of chainWebSpec.util) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        keysets: utilKeysets,
        signer: signer || client.network.senderAccount,
      });
      logger.success(`Deployed ${dep.name}`);
    }
  },
} as PactPrelude;
