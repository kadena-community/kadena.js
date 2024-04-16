// vite.config.ts
import { vanillaExtractPlugin } from "file:///Users/mulder/code/repos/kadena/kadena.js/node_modules/.pnpm/@vanilla-extract+vite-plugin@4.0.7_@types+node@18.17.14_vite@4.4.8/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import react from "file:///Users/mulder/code/repos/kadena/kadena.js/node_modules/.pnpm/@vitejs+plugin-react-swc@3.5.0_vite@4.4.8/node_modules/@vitejs/plugin-react-swc/index.mjs";
import fs from "fs";
import path from "path";
import { defineConfig } from "file:///Users/mulder/code/repos/kadena/kadena.js/node_modules/.pnpm/vite@4.4.8_@types+node@18.17.14/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///Users/mulder/code/repos/kadena/kadena.js/node_modules/.pnpm/vite-plugin-static-copy@1.0.1_vite@4.4.8/node_modules/vite-plugin-static-copy/dist/index.js";
import tsconfigPaths from "file:///Users/mulder/code/repos/kadena/kadena.js/node_modules/.pnpm/vite-tsconfig-paths@4.2.1_typescript@5.2.2_vite@4.4.8/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/mulder/code/repos/kadena/kadena.js/packages/apps/dev-wallet";
function getMonorepoPackagesFromPackageJson() {
  const packageJson = fs.readFileSync(
    path.resolve(__vite_injected_original_dirname, "./package.json"),
    "utf-8"
  );
  const { dependencies } = JSON.parse(packageJson);
  const packages = Object.keys(dependencies).filter(
    (key) => dependencies[key].startsWith("workspace:")
  );
  return packages;
}
var monorepoPackages = getMonorepoPackagesFromPackageJson();
var monorepoPathsRegex = monorepoPackages.map(
  (pkg) => new RegExp(`${pkg.replace("@kadena/", "")}`)
);
monorepoPackages.push("@kadena/client/fp");
var config = {
  plugins: [
    react(),
    tsconfigPaths({ root: "./" }),
    vanillaExtractPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "./"
        }
      ]
    })
  ],
  optimizeDeps: {
    // add all monorepo packages to optimizeDeps since they are commonjs
    include: [...monorepoPackages]
  },
  build: {
    commonjsOptions: {
      // add all monorepo packages path regex to commonjsOptions since they are commonjs
      include: [/node_modules/, ...monorepoPathsRegex]
    }
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  resolve: {
    // preserveSymlinks: true,
  }
};
var vite_config_default = defineConfig(config);
export {
  config,
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVsZGVyL2NvZGUvcmVwb3Mva2FkZW5hL2thZGVuYS5qcy9wYWNrYWdlcy9hcHBzL2Rldi13YWxsZXRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdWxkZXIvY29kZS9yZXBvcy9rYWRlbmEva2FkZW5hLmpzL3BhY2thZ2VzL2FwcHMvZGV2LXdhbGxldC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbXVsZGVyL2NvZGUvcmVwb3Mva2FkZW5hL2thZGVuYS5qcy9wYWNrYWdlcy9hcHBzL2Rldi13YWxsZXQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2YW5pbGxhRXh0cmFjdFBsdWdpbiB9IGZyb20gJ0B2YW5pbGxhLWV4dHJhY3Qvdml0ZS1wbHVnaW4nO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIFVzZXJDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSAndml0ZS1wbHVnaW4tc3RhdGljLWNvcHknO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbi8qKlxuICogR2V0IGxpc3Qgb2YgbW9ub3JlcG8gcGFja2FnZXMgZnJvbSBwYWNrYWdlLmpzb24gbm9uLWRldi1kZXBlbmRlbmNpZXNcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX0gLSBsaXN0IG9mIHBhY2thZ2UgbmFtZXNcbiAqL1xuZnVuY3Rpb24gZ2V0TW9ub3JlcG9QYWNrYWdlc0Zyb21QYWNrYWdlSnNvbigpIHtcbiAgY29uc3QgcGFja2FnZUpzb24gPSBmcy5yZWFkRmlsZVN5bmMoXG4gICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcGFja2FnZS5qc29uJyksXG4gICAgJ3V0Zi04JyxcbiAgKTtcbiAgY29uc3QgeyBkZXBlbmRlbmNpZXMgfSA9IEpTT04ucGFyc2UocGFja2FnZUpzb24pO1xuICBjb25zdCBwYWNrYWdlcyA9IE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcykuZmlsdGVyKChrZXkpID0+XG4gICAgZGVwZW5kZW5jaWVzW2tleV0uc3RhcnRzV2l0aCgnd29ya3NwYWNlOicpLFxuICApO1xuXG4gIHJldHVybiBwYWNrYWdlcztcbn1cblxuY29uc3QgbW9ub3JlcG9QYWNrYWdlcyA9IGdldE1vbm9yZXBvUGFja2FnZXNGcm9tUGFja2FnZUpzb24oKTtcbmNvbnN0IG1vbm9yZXBvUGF0aHNSZWdleCA9IG1vbm9yZXBvUGFja2FnZXMubWFwKFxuICAocGtnKSA9PiBuZXcgUmVnRXhwKGAke3BrZy5yZXBsYWNlKCdAa2FkZW5hLycsICcnKX1gKSxcbik7XG5tb25vcmVwb1BhY2thZ2VzLnB1c2goJ0BrYWRlbmEvY2xpZW50L2ZwJyk7XG5cbmV4cG9ydCBjb25zdCBjb25maWc6IFVzZXJDb25maWcgPSB7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHRzY29uZmlnUGF0aHMoeyByb290OiAnLi8nIH0pLFxuICAgIHZhbmlsbGFFeHRyYWN0UGx1Z2luKCksXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgdGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnbWFuaWZlc3QuanNvbicsXG4gICAgICAgICAgZGVzdDogJy4vJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIF0sXG5cbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gYWRkIGFsbCBtb25vcmVwbyBwYWNrYWdlcyB0byBvcHRpbWl6ZURlcHMgc2luY2UgdGhleSBhcmUgY29tbW9uanNcbiAgICBpbmNsdWRlOiBbLi4ubW9ub3JlcG9QYWNrYWdlc10sXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIC8vIGFkZCBhbGwgbW9ub3JlcG8gcGFja2FnZXMgcGF0aCByZWdleCB0byBjb21tb25qc09wdGlvbnMgc2luY2UgdGhleSBhcmUgY29tbW9uanNcbiAgICAgIGluY2x1ZGU6IFsvbm9kZV9tb2R1bGVzLywgLi4ubW9ub3JlcG9QYXRoc1JlZ2V4XSxcbiAgICB9LFxuICB9LFxuXG4gIC8vIFZpdGUgb3B0aW9ucyB0YWlsb3JlZCBmb3IgVGF1cmkgZGV2ZWxvcG1lbnQgYW5kIG9ubHkgYXBwbGllZCBpbiBgdGF1cmkgZGV2YCBvciBgdGF1cmkgYnVpbGRgXG4gIC8vXG4gIC8vIDEuIHByZXZlbnQgdml0ZSBmcm9tIG9ic2N1cmluZyBydXN0IGVycm9yc1xuICBjbGVhclNjcmVlbjogZmFsc2UsXG4gIC8vIDIuIHRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDE0MjAsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgfSxcbiAgLy8gMy4gdG8gbWFrZSB1c2Ugb2YgYFRBVVJJX0RFQlVHYCBhbmQgb3RoZXIgZW52IHZhcmlhYmxlc1xuICAvLyBodHRwczovL3RhdXJpLnN0dWRpby92MS9hcGkvY29uZmlnI2J1aWxkY29uZmlnLmJlZm9yZWRldmNvbW1hbmRcbiAgZW52UHJlZml4OiBbJ1ZJVEVfJywgJ1RBVVJJXyddLFxuICByZXNvbHZlOiB7XG4gICAgLy8gcHJlc2VydmVTeW1saW5rczogdHJ1ZSxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhjb25maWcpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3WCxTQUFTLDRCQUE0QjtBQUM3WixPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQWdDO0FBQ3pDLFNBQVMsc0JBQXNCO0FBQy9CLE9BQU8sbUJBQW1CO0FBTjFCLElBQU0sbUNBQW1DO0FBWXpDLFNBQVMscUNBQXFDO0FBQzVDLFFBQU0sY0FBYyxHQUFHO0FBQUEsSUFDckIsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUNBLFFBQU0sRUFBRSxhQUFhLElBQUksS0FBSyxNQUFNLFdBQVc7QUFDL0MsUUFBTSxXQUFXLE9BQU8sS0FBSyxZQUFZLEVBQUU7QUFBQSxJQUFPLENBQUMsUUFDakQsYUFBYSxHQUFHLEVBQUUsV0FBVyxZQUFZO0FBQUEsRUFDM0M7QUFFQSxTQUFPO0FBQ1Q7QUFFQSxJQUFNLG1CQUFtQixtQ0FBbUM7QUFDNUQsSUFBTSxxQkFBcUIsaUJBQWlCO0FBQUEsRUFDMUMsQ0FBQyxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxZQUFZLEVBQUUsQ0FBQyxFQUFFO0FBQ3REO0FBQ0EsaUJBQWlCLEtBQUssbUJBQW1CO0FBRWxDLElBQU0sU0FBcUI7QUFBQSxFQUNoQyxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFBQSxJQUM1QixxQkFBcUI7QUFBQSxJQUNyQixlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsY0FBYztBQUFBO0FBQUEsSUFFWixTQUFTLENBQUMsR0FBRyxnQkFBZ0I7QUFBQSxFQUMvQjtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsaUJBQWlCO0FBQUE7QUFBQSxNQUVmLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxrQkFBa0I7QUFBQSxJQUNqRDtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLGFBQWE7QUFBQTtBQUFBLEVBRWIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQTtBQUFBO0FBQUEsRUFHQSxXQUFXLENBQUMsU0FBUyxRQUFRO0FBQUEsRUFDN0IsU0FBUztBQUFBO0FBQUEsRUFFVDtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhLE1BQU07IiwKICAibmFtZXMiOiBbXQp9Cg==
