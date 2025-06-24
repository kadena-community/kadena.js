import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

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

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: [...monorepoPackages],
  },
  build: {
    commonjsOptions: {
      include: [/packages\//, /node_modules\//],
    },
  },
});
