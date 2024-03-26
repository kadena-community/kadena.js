import {
  getSerializableNetworkConfig,
  resolveConfig,
} from '@kadena/toolbox/config';
import type { UnpluginFactory, WebpackPluginInstance } from 'unplugin';
import { createWebpackPlugin } from 'unplugin';
import webpack from 'webpack';
import { PLUGIN_NAME, startToolboxNetwork } from './core';
import type { Options } from './core/options';

const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  return {
    name: PLUGIN_NAME,
    enforce: 'post',
    webpack: async (compiler) => {
      const toolboxConfig = await resolveConfig();
      compiler.hooks.done.tapPromise(PLUGIN_NAME, async () => {
        const networkConfig = getSerializableNetworkConfig(toolboxConfig);
        const define = new webpack.DefinePlugin({
          'globalThis.__KADENA_TOOLBOX_NETWORK_CONFIG__':
            JSON.stringify(networkConfig),
        });
        // @ts-ignore
        define.apply(compiler);
      });
      compiler.hooks.afterDone.tap(PLUGIN_NAME, async () => {
        if (compiler.options.mode === 'development') {
          await startToolboxNetwork(
            { isServe: true, isTest: false },
            toolboxConfig,
            options!,
          );
        }
      });
    },
  };
};

export default createWebpackPlugin(unpluginFactory) as (
  options?: Options,
) => WebpackPluginInstance;
