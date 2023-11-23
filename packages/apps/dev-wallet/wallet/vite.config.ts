import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Get list of monorepo packages from package.json non-dev-dependencies
 * @returns {string[]} - list of package names
 */
function getMonorepoPackagesFromPackageJson() {
  const packageJson = fs.readFileSync(
    path.resolve(__dirname, './package.json'),
    'utf-8',
  );
  const { dependencies } = JSON.parse(packageJson);
  const packages = Object.keys(dependencies).filter((key) =>
    dependencies[key].startsWith('workspace:'),
  );

  return packages;
}

const monorepoPackages = getMonorepoPackagesFromPackageJson();
monorepoPackages.push('@kadena/client/fp');

export const config: UserConfig = {
  plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],

  optimizeDeps: {
    include: [...monorepoPackages],
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/, ...monorepoPackages],
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
};

export default defineConfig(config);
