import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit';
import '@nuxt/schema';
import type { Options } from './core/options';
import vite from './vite';
import webpack from './webpack';

export interface ModuleOptions extends Options {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-unplugin-starter',
    configKey: 'unpluginStarter',
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    //@ts-ignore
    addVitePlugin(() => vite(options));
    addWebpackPlugin(() => webpack(options));

    // ...
  },
});
