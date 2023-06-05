/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @rushstack/typedef-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { unwrapData } from './utils/dataWrapper';
import { getCapabilities } from './utils/getCapabilities';
import { getBlockPointer, getPointer, IPointer } from './utils/getPointer';
import { functionCalls, parser } from './utils/pactGrammar';
import { FAILED } from './utils/parserUtilities';

export interface ISchema {
  name: string;
  doc?: string;
  properties?: Array<{
    name: string;
    type: string | { kind: string; value: string };
  }>;
}

interface IMethod {
  name: string;
  returnType?: string | { kind: string; value: string };
  doc?: string;
  parameters?: Array<{
    name: string;
    type: string | { kind: string; value: string };
  }>;
}

export interface IFunction extends IMethod {
  bodyPointer?: number;
  requiredCapabilities?: string[];
  withCapabilities?: string[];
  functionCalls?: {
    internal: string[];
    external: Array<{ namespace?: string; module: string; func: string }>;
  };
  externalFnCalls?: Array<{
    namespace?: string;
    module: string;
    func: string;
  }>;
  allExtractedCaps?: Array<{
    name: string;
    fullModuleName: string;
    reason: 'with-capability' | 'compose-capability';
    origin: string;
    capability: ICapability;
  }>;
}

export interface ICapability extends IMethod {
  composeCapabilities?: string[];
}

export interface IModule {
  kind: string;
  namespace: string;
  name: string;
  doc: string;
  governance: string;
  usedModules?: Array<{
    name: string;
    namespace?: string;
    hash?: string;
    imports?: string[];
  }>;
  usedInterface?: Array<{ name: string; namespace?: string }>;
  functions?: IFunction[];
  capabilities?: ICapability[];
  schemas?: ISchema[];
}

export interface IPactTree {
  namespace?: string[];
  usedModules?: Array<{ name: string; hash?: string }>;
  module?: IModule[];
}

// return the namespace of the module in case the file has multiple modules and namespaces
const getNamespace = (
  moduleLoc: number,
  allNamespaces?: Array<{ location: number; name: string }>,
) => {
  if (!allNamespaces) return '';
  const { name } = allNamespaces.reduce(
    (namespace, { location, name }) => {
      if (location < moduleLoc && location > namespace.location) {
        return { location, name };
      }
      return namespace;
    },
    { location: 0, name: '' },
  );
  return name;
};

// return the list of modules used in the module including the modules used in root level
const getUsedModules = (
  moduleLoc: number,
  allUsedModules?: Array<{
    location: number;
    name: string;
    namespace: string;
    hash?: string;
  }>,
) => {
  if (!allUsedModules) return [];
  const list = allUsedModules.reduce((list, { location, ...mod }) => {
    if (location < moduleLoc) {
      return [...list, mod];
    }
    return list;
  }, [] as Array<{ name: string; namespace: string; hash?: string; imports?: Array<string> }>);

  return list;
};

// returns the list of modules used in the functions of the module without using "use" keyword in the module
function getUsedModulesInFunctions(functions?: IFunction[]) {
  if (!functions) return [];

  return functions.flatMap((fun) => {
    const externalFnCalls = fun.externalFnCalls;
    if (!externalFnCalls) return [];
    return externalFnCalls.map(({ namespace, module: name }) => ({
      namespace: namespace || '',
      name,
    }));
  });
}

const isNotDuplicated =
  <T>(isEqual: (a: T, b: T) => boolean) =>
  (a: T, idx: number, list: T[]) =>
    list.findIndex((b) => isEqual(a, b)) === idx;

const isNotDuplicatedModule = isNotDuplicated<{
  name: string;
  namespace?: string;
}>((a, b) => a.name === b.name && a.namespace === b.namespace);

function fileParser(
  contract: string,
  namespace: string = '',
): [IModule[], IPointer] {
  const pointer = getPointer(contract);
  const result = parser(pointer);
  if (result === FAILED) {
    console.error('there is no rule matched with this token', pointer.next());
    throw new Error('parsing error');
  }
  const tree = unwrapData(result);
  const { modules, namespaces, usedModules } = tree;

  const extModules =
    modules?.map(({ location, module: mod }) => ({
      ...mod,
      namespace: getNamespace(location, namespaces) || namespace,
      usedModules: [
        ...(mod.usedModules || []),
        ...getUsedModules(location, usedModules),
        ...getUsedModulesInFunctions(mod.functions),
      ].filter(isNotDuplicatedModule),
    })) || [];

  return [extModules, pointer];
}

// fetch/read the contract file only once
const moduleLoader = (getContract: (fullName: string) => Promise<string>) => {
  const contents: Record<string, Promise<string>> = {};
  return (fullName: string) => {
    if (contents[fullName] === undefined) {
      contents[fullName] = getContract(fullName);
    }
    return contents[fullName];
  };
};

export const getModuleFullName = (mod: { name: string; namespace?: string }) =>
  mod.namespace ? `${mod.namespace}.${mod.name}` : mod.name;

type IModuleWithPointer = IModule & { pointer?: IPointer };

// parse a module and its dependencies
async function parserAllModules(
  fullName: string,
  namespace: string,
  getContent: (name: string) => Promise<string>,
): Promise<Array<IModuleWithPointer>> {
  const content = await getContent(fullName);
  const [modules, pointer] = fileParser(content, namespace);
  const dependencies = await Promise.all(
    modules.map(async (mod) => {
      (mod as any).pointer = pointer;
      const interfaceOrModule = [
        ...(mod.usedModules || []),
        ...(mod.usedInterface || []),
      ];
      if (interfaceOrModule.length === 0) return [];
      const mods = await Promise.all(
        interfaceOrModule.map(async (usedModule) =>
          parserAllModules(
            getModuleFullName(usedModule),
            usedModule.namespace || '',
            getContent,
          ),
        ),
      );
      return mods.flat();
    }),
  );
  return [...modules, ...dependencies.flat()].filter(isNotDuplicatedModule);
}

// check function body again for checking function calls, internal and external
const getFunctionCalls = (
  bodyPointer: number | undefined,
  pointer: IPointer,
  fnList: string[],
  availableExternals: Array<{
    namespace?: string;
    module: string;
    func: string;
  }>,
): {
  internal?: string[];
  external?: Array<{ namespace?: string; module: string; func: string }>;
} => {
  if (bodyPointer !== undefined) {
    pointer.reset(bodyPointer);
    const blockPointer = getBlockPointer(pointer);
    const data = functionCalls(fnList, availableExternals)(blockPointer);
    if (data !== FAILED) {
      return unwrapData(data);
    }
  }

  return {};
};

// adding function calls to each function in the module
function addFunctionCalls(
  mod: IModule,
  allModule: Map<string, IModule>,
  pointer: IPointer,
) {
  if (mod.kind !== 'module') return mod;

  const usedModules = mod.usedModules;
  let externalFunctions: Array<{
    module: string;
    namespace: string | undefined;
    func: string;
  }> = [];

  if (usedModules && usedModules.length) {
    externalFunctions = usedModules.flatMap(({ name, namespace, imports }) => {
      if (imports && imports.length) {
        return imports.map((func) => ({
          module: name,
          namespace,
          func,
        }));
      }
      const usedModule = allModule.get(getModuleFullName({ name, namespace }));
      if (!usedModule || !usedModule.functions) return [];
      return usedModule.functions.map(({ name: func }) => ({
        module: name,
        namespace,
        func,
      }));
    });
  }
  if (!mod.functions) {
    mod.functions = [];
  }
  const internalFunctions = mod.functions.map(({ name }) => name);
  mod.functions = mod.functions.map((fun) => {
    if (!fun.bodyPointer) {
      return fun;
    }
    console.log('body', fun.name, fun.bodyPointer);
    const { internal = [], external = [] } = getFunctionCalls(
      fun.bodyPointer,
      pointer,
      internalFunctions,
      externalFunctions,
    );
    fun.functionCalls = {
      internal,
      external: [...external, ...(fun.externalFnCalls || [])],
    };
    delete fun.bodyPointer;
    return fun;
  });
}

// extract all capabilities for each function in the module
function addFunctionCapabilities(
  mod: IModule,
  allModule: Map<string, IModule>,
) {
  if (mod.kind !== 'module' || !mod.functions) return mod;
  mod.functions.forEach((fun) => {
    fun.allExtractedCaps = getCapabilities(
      allModule,
      getModuleFullName(mod),
      fun.name,
    );
  });
}

export async function pactParser(
  file: string,
  namespace: string = '',
  getContract: (fullName: string) => Promise<string>,
) {
  const modules = await parserAllModules(
    file,
    namespace,
    moduleLoader(getContract),
  );

  const allModules = new Map<string, IModuleWithPointer>();

  modules.forEach((mod) => {
    allModules.set(getModuleFullName(mod), mod);
  });

  modules.forEach((mod) => {
    addFunctionCalls(mod, allModules, mod.pointer!);
    delete mod.pointer;
  });

  modules.forEach((mod) => {
    addFunctionCapabilities(mod, allModules);
  });

  return Object.fromEntries(allModules);
}
