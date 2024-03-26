import type { RspackPluginInstance } from 'unplugin';
import { createRspackPlugin } from 'unplugin';

import { unpluginFactory } from '.';
import type { Options } from './core/options';

export default createRspackPlugin(unpluginFactory) as (
  options?: Options,
) => RspackPluginInstance;
