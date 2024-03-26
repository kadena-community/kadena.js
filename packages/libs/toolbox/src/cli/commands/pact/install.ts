import { defineCommand } from 'citty';
import { resolveConfig } from '../../../config';
import { installPact } from '../../../installer';
import { logger } from '../../../utils';

export const installCommand = defineCommand({
  meta: {
    name: 'install',
    description: 'Install pact version from github releases',
  },
  args: {
    version: {
      type: 'positional',
      name: 'version',
      description:
        'Pact version to install, e.g. 4.10.0 if not specified will use `config.pact.version` or latest',
      required: false,
    },

    latest: {
      type: 'boolean',
      name: 'latest',
      description: 'force install latest pact version',
      default: true,
    },
  },
  run: async ({ args }) => {
    const config = await resolveConfig();
    args.version = args.version ?? config.pactVersion;
    if (!args.version) {
      logger.info('Pact version not specified, installing latest');
    }
    const version = args.latest ? undefined : args.version;
    await installPact(version);
  },
});
