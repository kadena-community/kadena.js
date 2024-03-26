import { defineCommand } from 'citty';
import { resolveConfig } from '../../config';
import { versionCheckMiddleware } from '../../installer';
import { startLocalNetwork } from '../../network';

export const startCommand = defineCommand({
  meta: {
    name: 'start',
    description: 'Start a configured network locally',
  },
  args: {
    network: {
      type: 'positional',
      name: 'version',
      description: 'Network to start',
      required: false,
      default: 'local',
    },
    quiet: {
      type: 'boolean',
      name: 'quiet',
      alias: 'q',
      description: 'Silence logs',
      required: false,
    },
    tunnel: {
      type: 'boolean',
      name: 'tunnel',
      alias: 't',
      description: 'Start a cloudflare tunnel to the network',
      required: false,
      default: false,
    },
    clipboard: {
      type: 'boolean',
      name: 'clipboard',
      alias: 'c',
      description: 'Copy the network url to the clipboard',
      required: false,
      default: true,
    },
  },
  run: async ({ args }) => {
    await versionCheckMiddleware();
    const config = await resolveConfig();
    const { network, quiet, tunnel, clipboard } = args;
    const _network = await startLocalNetwork(config, {
      silent: quiet || tunnel,
      logAccounts: true,
      network,
      enableProxy: true,
      conflict: 'replace',

      proxyOptions: {
        showURL: true,
        isProd: false,
        tunnel,
        clipboard,
      },
    });
  },
});
