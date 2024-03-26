import {
  getSerializableNetworkConfig,
  resolveConfig,
} from '@kadena/toolbox/config';
import type { RsbuildPlugin } from '@rsbuild/core';
import { PLUGIN_NAME, startToolboxNetwork } from './core';
import type { Options } from './core/options';

export const pluginPactToolbox = (options?: Options): RsbuildPlugin => ({
  name: PLUGIN_NAME,
  async setup(api) {
    const toolboxConfig = await resolveConfig();
    api.modifyRsbuildConfig((config) => {
      if (!config.source) {
        config.source = {};
      }
      if (!config.source.define) {
        config.source.define = {};
      }
      const networkConfig = getSerializableNetworkConfig(toolboxConfig);
      config.source.define['globalThis.__KADENA_TOOLBOX_NETWORK_CONFIG__'] =
        JSON.stringify(networkConfig);
    });
    api.onAfterStartDevServer(async () => {
      await startToolboxNetwork(
        {
          isServe: true,
          isTest: false,
        },
        toolboxConfig,
        options,
      );
    });
  },
});
