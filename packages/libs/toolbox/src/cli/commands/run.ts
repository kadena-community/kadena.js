import { defineCommand } from 'citty';
import { runScript } from '../../script';
import { logger } from '../../utils';

export const runCommand = defineCommand({
  meta: {
    name: 'run',
    description: 'Run a script with the toolbox runtime',
  },
  args: {
    script: {
      type: 'positional',
      name: 'script',
      description: 'Script to run',
      required: true,
    },
    start: {
      type: 'boolean',
      name: 'start',
      alias: 's',
      description: 'Start the network before running the script',
      required: false,
      default: true,
    },
    network: {
      type: 'string',
      name: 'network',
      alias: 'n',
      description: 'Network to use',
      required: false,
      default: 'local',
    },
  },
  run: async ({ args }) => {
    const { script, network, start, ...rest } = args;
    logger.start(`Running script ${script} on network ${network}`);
    await runScript(script, {
      network,
      args: rest,
      scriptOptions: {
        autoStartNetwork: start,
      },
    });
  },
});
