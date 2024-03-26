import type { NextConfig } from 'next';
import type { Options } from './core/options';
import webpackPlugin from './webpack';

function withPactToolbox(pluginOptions?: Options) {
  return (nextConfig: NextConfig = {}) => {
    return {
      ...nextConfig,
      webpack(config: any, options: any) {
        config.plugins.push(webpackPlugin(pluginOptions));
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    };
  };
}

export default withPactToolbox;
