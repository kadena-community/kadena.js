import { defineCommand } from 'citty';
import { join } from 'pathe';
import { PactToolboxClient } from '../../client';
import { resolveConfig } from '../../config';
import { downloadPreludes } from '../../prelude';
import { logger } from '../../utils';

export const preludeCommand = defineCommand({
  meta: {
    name: 'download',
    description: 'Download configured preludes',
  },
  run: async () => {
    const config = await resolveConfig();
    const client = new PactToolboxClient(config);
    await downloadPreludes({
      client,
      contractsDir: config.contractsDir ?? 'pact',
      preludes: config.preludes ?? [],
    });
    logger.box(
      `All preludes downloaded successfully 🎉\nYou can load them in repl from ${join(
        process.cwd(),
        config.contractsDir ?? '',
        'prelude',
        'init.repl',
      )}`,
    );
  },
});
