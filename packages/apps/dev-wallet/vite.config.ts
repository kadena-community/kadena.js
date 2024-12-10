import { vanillaExtractPlugin as vanillaExtractEsbuildPlugin } from '@vanilla-extract/esbuild-plugin';
import { vanillaExtractPlugin as vanillaExtractVitePlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
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
const monorepoPathsRegex = monorepoPackages.map(
  (pkg) => new RegExp(`${pkg.replace('@kadena/', '')}`),
);
monorepoPackages.push('@kadena/client/fp');

export const config: UserConfig = {
  plugins: [
    react(),
    tsconfigPaths({ root: './' }),
    vanillaExtractVitePlugin(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: './',
        },
        // this is only for plugins that are hosted and maintain with kadena's teams
        // other plugins should be hosted in their own domain; we might later create a plugin registry and host them there.
        {
          src: 'node_modules/@kadena/dev-wallet-plugin/dist/*',
          dest: './hosted-plugins/pact-remote-console/',
        },
      ],
    }),
  ],

  optimizeDeps: {
    // add all monorepo packages to optimizeDeps since they are commonjs
    include: [...monorepoPackages],
    esbuildOptions: {
      minify: false,
      plugins: [vanillaExtractEsbuildPlugin({ runtime: true })],
    },
  },

  build: {
    ssr: false,
    minify: false,
    sourcemap: 'hidden',
    rollupOptions: {
      input: {
        html: 'index.html',
        main: 'src/index.ts', // your main app entry point
        sw: 'src/service-worker/service-worker.ts', // entry for the service worker
      },
      output: {
        minifyInternalExports: false,
        // this lets us specify the output filename pattern for each chunk, later we can use this to cache each chunk in the service worker
        manualChunks: {
          'react-libs': [
            'react',
            'react-dom',
            'react-router-dom',
            '@vanilla-extract/css',
          ],
          'kadena-libs': ['@kadena/client', '@kadena/client-utils'],
          'kadena-ui': ['@kadena/kode-ui', '@kadena/kode-icons'],
        },
        entryFileNames: (chunk) => {
          return [
            'sw',
            'react-libs',
            'kadena-libs',
            'kadena-ui',
            'html',
          ].includes(chunk.name)
            ? 'assets/[name].js'
            : 'assets/[name]-[hash].js';
        },

        chunkFileNames: (chunk) =>
          ['sw', 'react-libs', 'kadena-libs', 'kadena-ui', 'html'].includes(
            chunk.name,
          )
            ? 'assets/[name].js'
            : 'assets/[name]-[hash].js',
      },
    },
    commonjsOptions: {
      // add all monorepo packages path regex to commonjsOptions since they are commonjs
      include: [/node_modules/, ...monorepoPathsRegex],
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
  resolve: {
    // preserveSymlinks: true,\
  },
};

export default defineConfig(config);
