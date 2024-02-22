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

export function marmaladePath(path: string) {
  return `gh:salamaashoush/marmalade/pact/${path}#main`;
}

export const marmaladeSpecs: Record<string, PactDependency[]> = {
  kip: [
    preludeSpec(
      'account-protocols-v1.pact',
      marmaladePath('kip/account-protocols-v1.pact'),
      'kip',
    ),
    preludeSpec('manifest.pact', marmaladePath('kip/manifest.pact'), 'kip'),
    preludeSpec(
      'token-policy-v2.pact',
      marmaladePath('kip/token-policy-v2.pact'),
      'kip',
    ),
    preludeSpec(
      'poly-fungible-v3.pact',
      marmaladePath('kip/poly-fungible-v3.pact'),
      'kip',
    ),
  ],
  util: [
    preludeSpec(
      'fungible-util.pact',
      marmaladePath('util/fungible-util.pact'),
      'util',
    ),
    preludeSpec('guards1.pact', marmaladePath('util/guards1.pact'), 'util'),
  ],
  'marmalade-ns': [
    preludeSpec(
      'ns-marmalade.pact',
      marmaladePath('marmalade-ns/ns-marmalade.pact'),
      'marmalade-ns',
    ),
    preludeSpec(
      'ns-contract-admin.pact',
      marmaladePath('marmalade-ns/ns-contract-admin.pact'),
      'marmalade-ns',
    ),
  ],
  'marmalade-v2': [
    preludeSpec(
      'ledger.interface.pact',
      marmaladePath('ledger/ledger.interface.pact'),
      'marmalade-v2',
    ),
    preludeSpec(
      'sale.interface.pact',
      marmaladePath('policy-manager/sale.interface.pact'),
      'marmalade-v2',
    ),
    preludeSpec(
      'policy-manager.pact',
      marmaladePath('policy-manager/policy-manager.pact'),
      'marmalade-v2',
    ),
    preludeSpec(
      'ledger.pact',
      marmaladePath('ledger/ledger.pact'),
      'marmalade-v2',
    ),
    // Concrete policies
    preludeSpec(
      'collection-policy-v1.pact',
      marmaladePath(
        'concrete-policies/collection-policy/collection-policy-v1.pact',
      ),
      'marmalade-v2',
    ),
    preludeSpec(
      'guard-policy-v1.pact',
      marmaladePath('concrete-policies/guard-policy/guard-policy-v1.pact'),
      'marmalade-v2',
    ),
    preludeSpec(
      'non-fungible-policy-v1.pact',
      marmaladePath(
        'concrete-policies/non-fungible-policy/non-fungible-policy-v1.pact',
      ),
      'marmalade-v2',
    ),
    preludeSpec(
      'royalty-policy-v1.pact',
      marmaladePath('concrete-policies/royalty-policy/royalty-policy-v1.pact'),
      'marmalade-v2',
    ),
    // init
    preludeSpec(
      'manager-init.pact',
      marmaladePath('policy-manager/manager-init.pact'),
      'marmalade-v2',
    ),
    // util
    preludeSpec(
      'util-v1.pact',
      marmaladePath('marmalade-util/util-v1.pact'),
      'marmalade-v2',
    ),
  ],
  'marmalade-sale': [
    preludeSpec(
      'conventional-auction.pact',
      marmaladePath(
        'sale-contracts/conventional-auction/conventional-auction.pact',
      ),
      'marmalade-sale',
    ),
    preludeSpec(
      'dutch-auction.pact',
      marmaladePath('sale-contracts/dutch-auction/dutch-auction.pact'),
      'marmalade-sale',
    ),
  ],
};

export default {
  name: 'kadena/marmalade',
  specs: marmaladeSpecs,
  requires: ['kadena/chainweb'],
  async shouldDeploy(client: PactToolboxClient) {
    const namespaces = ['kip', 'util', 'marmalade-v2', 'marmalade-sale'];
    const contracts = ['marmalade-v2.ledger', 'marmalade-v2.util-v1'];
    const defined = await Promise.all(
      namespaces.map((ns) => client.isNamespaceDefined(ns)),
    );
    const deployed = await Promise.all(
      contracts.map((c) => client.isContractDeployed(c)),
    );
    return defined.some((d) => !d) || deployed.some((d) => !d);
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
    let { signer } = params;
    if (!signer) {
      signer = 'sender00';
    }
    const keys = client.getSigner(signer);
    const keysets = {
      'marmalade-admin': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
      'marmalade-user': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
      'marmalade-contract-admin': {
        keys: [keys.publicKey],
        pred: 'keys-all',
      },
    } as Record<string, KeysetConfig>;
    const preludeDir = join(client.getPreludeDir(), 'kadena/marmalade');

    const createNsSpec = marmaladeSpecs['marmalade-ns'].find((s) =>
      s.name.includes('ns-marmalade.pact'),
    );
    if (!createNsSpec) {
      throw new Error('Could not find marmalade-ns/ns-marmalade.pact');
    }
    await deployPactDependency(createNsSpec, preludeDir, client, {
      ...params,
      data: {
        ns: 'kip',
      },
      keysets,
      signer,
    });
    logger.success(`Created kip namespace`);

    await deployPactDependency(createNsSpec, preludeDir, client, {
      ...params,
      data: {
        ns: 'util',
      },
      keysets,
      signer,
    });
    logger.success(`Created util namespace`);

    for (const dep of marmaladeSpecs.kip) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        data: {
          ns: 'kip',
          ...params.data,
        },
        keysets,
        signer,
      });
      logger.success(`Deployed ${dep.name}`);
    }

    // create marmalade-v2 namespaces
    for (const dep of marmaladeSpecs['marmalade-ns']) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        data: {
          ns: 'marmalade-v2',
          ...params.data,
        },
        keysets: {
          ...keysets,
          'marmalade-v2.marmalade-contract-admin': {
            keys: [keys.publicKey],
            pred: 'keys-all',
          },
        },
        signer,
      });
      logger.success(`Created marmalade-v2 namespace`);
    }

    // create marmalade-sale namespaces
    for (const dep of marmaladeSpecs['marmalade-ns']) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        data: {
          ns: 'marmalade-sale',
          ...params.data,
        },
        keysets: {
          ...keysets,
          'marmalade-sale.marmalade-contract-admin': {
            keys: [keys.publicKey],
            pred: 'keys-all',
          },
        },
        signer,
      });
      logger.success(`Created marmalade-sale namespace`);
    }

    // deploy  util
    for (const dep of marmaladeSpecs.util) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        data: {
          ns: 'kip',
          ...params.data,
        },
        keysets,
        signer,
      });
      logger.success(`Deployed ${dep.name}`);
    }

    // deploy  marmalade-v2
    for (const dep of marmaladeSpecs['marmalade-v2']) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        data: {
          ns: 'marmalade-v2',
          ...params.data,
        },
        keysets,
        signer,
      });
      logger.success(`Deployed ${dep.name}`);
    }

    // deploy  marmalade-sale
    for (const dep of marmaladeSpecs['marmalade-sale']) {
      await deployPactDependency(dep, preludeDir, client, {
        ...params,
        data: {
          ns: 'marmalade-sale',
          ...params.data,
        },
        keysets,
        signer,
      });
      logger.success(`Deployed ${dep.name}`);
    }
  },
} as PactPrelude;
