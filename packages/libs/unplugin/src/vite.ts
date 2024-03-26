import { createVitePlugin } from 'unplugin';
import type { Plugin } from 'vite';
import { unpluginFactory } from '.';
import type { Options } from './core/options';

export default createVitePlugin(unpluginFactory) as (
  options?: Options,
) => Plugin | Plugin[];
