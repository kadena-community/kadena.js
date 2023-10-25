import { generateDts, pactParser } from '@kadena/pactjs-generator';
import { retrieveContractFromChain } from '../utils/retrieveContractFromChain.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import { dirname, join } from 'path';
import { rimraf } from 'rimraf';
export const TARGET_PACKAGE = '.kadena/pactjs-generated';
const shallowFindFile = (path, file) => {
    while (!existsSync(join(path, file))) {
        path = join(path, '..');
        if (path === '/') {
            return;
        }
    }
    return join(path, file);
};
function verifyTsconfigTypings(tsconfigPath, program) {
    if (tsconfigPath === undefined || tsconfigPath.length === 0) {
        console.error('Could not find tsconfig.json, skipping types verification');
    }
    else {
        console.log(`\nVerifying tsconfig.json at \`${tsconfigPath}\``);
        const tsconfig = readFileSync(tsconfigPath, 'utf8');
        if (!tsconfig.includes('.kadena/pactjs-generated')) {
            console.log(`\n!!! WARNING: You have not added .kadena/pactjs-generated to tsconfig.json. Add it now.
{ "compilerOptions": { "types": [".kadena/pactjs-generated"] } }`);
        }
    }
}
async function generator(args) {
    if (args.contract !== undefined) {
        console.log(`Generating pact contracts from chainweb for ${args.contract.join(',')}`);
    }
    if (args.file !== undefined) {
        console.log(`Generating pact contracts from files for ${args.file.join(',')}`);
    }
    const getContract = async (name) => {
        console.log('fetching', name);
        if (args.api !== undefined &&
            args.chain !== undefined &&
            args.network !== undefined) {
            const content = await retrieveContractFromChain(name, args.api, args.chain, args.network);
            return content ?? '';
        }
        console.log(`
      the generator tries to fetch ${name} from the blockchain but the api data is not presented.
      this happen because ${name} mentioned via --contracts directly or it is a dependency of a module.
      the scrip skips this module
      `);
        return '';
    };
    const files = args.file === undefined
        ? []
        : args.file.map((file) => readFileSync(join(process.cwd(), file), 'utf-8'));
    const modules = await pactParser({
        contractNames: args.contract,
        files,
        getContract,
        namespace: args.namespace,
    });
    if (process.env.DEBUG === 'dev') {
        writeFileSync(join(process.cwd(), 'modules.json'), JSON.stringify(modules, undefined, 2));
    }
    const moduleDtss = new Map();
    Object.keys(modules).map((name) => {
        if (['', undefined, null].includes(modules[name].namespace)) {
            console.log(`
      WARNING: No namespace found for module "${name}". You can pass --namespace as a fallback.
      `);
        }
        moduleDtss.set(name, generateDts(name, modules));
    });
    return moduleDtss;
}
export const generate = (program, version) => async (args) => {
    // walk up in file tree from process.cwd() to get the package.json
    const targetPackageJson = shallowFindFile(process.cwd(), 'package.json');
    if (targetPackageJson === undefined ||
        targetPackageJson.length === 0 ||
        targetPackageJson === '/') {
        program.error('Could not find package.json');
        return;
    }
    const moduleDtss = await generator(args);
    console.log(`Using package.json at ${targetPackageJson}`);
    const targetDirectory = join(dirname(targetPackageJson), 'node_modules', TARGET_PACKAGE);
    if (args.clean === true) {
        console.log(`Cleaning ${targetDirectory}`);
        rimraf.sync(targetDirectory);
    }
    if (!existsSync(targetDirectory)) {
        console.log(`Creating directory ${targetDirectory}`);
        mkdirp.sync(targetDirectory);
    }
    moduleDtss.forEach((dts, moduleName) => {
        const targetFilePath = join(dirname(targetPackageJson), 'node_modules', TARGET_PACKAGE, `${moduleName}.d.ts`);
        // write dts to index.d.ts to file
        const indexPath = join(targetDirectory, 'index.d.ts');
        const exportStatement = `export * from './${moduleName}.js';`;
        // always overwrite existing file
        console.log(`Writing to new file ${targetFilePath}`);
        writeFileSync(targetFilePath, dts);
        // if indexPath exists, append export to existing file
        if (existsSync(indexPath)) {
            console.log(`Appending to existing file ${indexPath}`);
            const indexDts = readFileSync(indexPath, 'utf8');
            // Append the export to the file if it's not already there.
            if (!indexDts.includes(exportStatement)) {
                const separator = indexDts.endsWith('\n') ? '' : '\n';
                const newIndexDts = [indexDts, exportStatement].join(separator);
                writeFileSync(indexPath, newIndexDts);
            }
        }
        else {
            console.log(`Writing to new file ${indexPath}`);
            writeFileSync(indexPath, exportStatement);
        }
    });
    // write npm init to package.json
    const defaultPackageJsonPath = join(targetDirectory, 'package.json');
    // if exists, do nothing
    if (existsSync(defaultPackageJsonPath)) {
        console.log(`Package.json already exists at ${defaultPackageJsonPath}`);
    }
    else {
        // write default contents to package.json
        console.log(`Writing default package.json to ${defaultPackageJsonPath}`);
        writeFileSync(defaultPackageJsonPath, JSON.stringify({
            name: TARGET_PACKAGE,
            version: version,
            description: 'TypeScript definitions for @kadena/client',
            types: 'index.d.ts',
            keywords: ['pact', 'contract', 'pactjs'],
            author: `@kadena/pactjs-cli@${version}`,
        }, null, 2));
    }
    const tsconfigPath = shallowFindFile(join(process.cwd()), 'tsconfig.json');
    verifyTsconfigTypings(tsconfigPath, program);
};
