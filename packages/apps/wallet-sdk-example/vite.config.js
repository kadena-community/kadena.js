var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
/**
 * Get list of monorepo packages from package.json non-dev-dependencies
 * @returns {string[]} - list of package names
 */
function getMonorepoPackagesFromPackageJson() {
    var packageJson = fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf-8');
    var dependencies = JSON.parse(packageJson).dependencies;
    var packages = Object.keys(dependencies).filter(function (key) {
        return dependencies[key].startsWith('workspace:');
    });
    return packages;
}
var monorepoPackages = getMonorepoPackagesFromPackageJson();
monorepoPackages.push('@kadena/client-utils');
monorepoPackages.push('@kadena/cryptography-utils');
monorepoPackages.push('@kadena/pactjs');
monorepoPackages.push('@kadena/wallet-sdk');
var monorepoPathsRegex = monorepoPackages.map(function (pkg) { return new RegExp("".concat(pkg.replace('@kadena/', ''))); });
monorepoPackages.push('@kadena/client/fp');
export var config = {
    plugins: [vanillaExtractPlugin(), react()],
    optimizeDeps: {
        // add all monorepo packages to optimizeDeps since they are commonjs
        include: __spreadArray([], monorepoPackages, true),
    },
    build: {
        commonjsOptions: {
            // add all monorepo packages path regex to commonjsOptions since they are commonjs
            include: __spreadArray([/node_modules/], monorepoPathsRegex, true),
        },
    },
};
export default defineConfig(config);
