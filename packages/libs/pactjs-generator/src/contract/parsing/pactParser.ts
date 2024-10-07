import { unwrapData } from './utils/dataWrapper';
import { getCapabilities } from './utils/getCapabilities';
import type { IPointer } from './utils/getPointer';
import { getBlockPointer, getPointer } from './utils/getPointer';
import { functionCalls, parser } from './utils/pactGrammar';
import type { IModuleLike } from './utils/utils';
import { getModuleFullName } from './utils/utils';

export interface IType {
  kind: string;
  value: string;
  isList?: true;
}

interface ISchema {
  name: string;
  doc?: string;
  properties?: Array<{
    name: string;
    type: string | IType;
  }>;
}

interface IMethod {
  name: string;
  kind: string; // 'defun' | 'defcap' | 'defpact'; // need to fix typing
  returnType?: string | IType;
  doc?: string;
  parameters?: Array<{
    name: string;
    type: string | IType;
  }>;
}

export interface IFunction extends IMethod {
  bodyPointer?: number;
  requiredCapabilities?: string[];
  withCapabilities?: string[];
  events?: string[];
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
  dependencies?: IModuleLike[];
}

interface IUsedModules {
  name: string;
  hash?: string;
  location?: number;
  namespace?: string;
  imports?: string[];
}

interface IPactTree {
  namespace?: string[];
  usedModules?: Array<IUsedModules>;
  module?: IModule[];
}

// return the namespace of the module in case the file has multiple modules and namespaces
const getNamespace = (
  moduleLoc: number,
  allNamespaces?: Array<{ location: number; name: string }>,
): string => {
  if (allNamespaces === undefined) return '';
  const { name } = allNamespaces.reduce(
    (prev, namespace) => {
      if (
        namespace.location < moduleLoc &&
        namespace.location > prev.location
      ) {
        return namespace;
      }
      return prev;
    },
    { location: -2, name: '' },
  );
  return name;
};

// return the list of modules used in the module including the modules used in root level
const getUsedModules = (
  moduleLoc: number,
  allUsedModules?: IUsedModules[],
): Array<Omit<IUsedModules, 'location'>> => {
  if (!allUsedModules) return [];
  const list = allUsedModules.reduce(
    (list, { location, ...mod }) => {
      if (location !== undefined && location < moduleLoc) {
        return [...list, mod];
      }
      return list;
    },
    [] as Exclude<IPactTree['usedModules'], undefined>,
  );

  return list;
};

// returns the list of modules used in the functions of the module without using "use" keyword in the module
function getUsedModulesInFunctions(functions?: IFunction[]): IModuleLike[] {
  if (!functions) return [];

  return functions.flatMap((fun) => {
    const externalFnCalls = fun.externalFnCalls ?? [];
    const calls = externalFnCalls.map(({ namespace, module: name, func }) => ({
      namespace: namespace ?? '',
      name,
      imports: [func],
    }));
    return [...calls];
  });
}

// returns the list of modules used in the functions of the module without using "use" keyword in the module
function getUsedInterfacesInFunctions(functions?: IFunction[]): IModuleLike[] {
  if (!functions) return [];

  return functions.flatMap((fun) => {
    const fromParameters =
      (fun.parameters
        ?.map(({ type }) => {
          if (typeof type === 'object' && type.kind === 'module') {
            const parts = type.value.split('.');
            return {
              namespace: parts.length === 2 ? parts[0] : '',
              name: parts[parts.length - 1],
              imports: [],
            };
          }
        })
        .filter(Boolean) as {
        namespace: string;
        name: string;
        imports: string[];
      }[]) ?? [];
    return fromParameters;
  });
}

const isNotDuplicated =
  <T>(isEqual: (a: T, b: T) => boolean) =>
  (a: T, idx: number, list: T[]): boolean =>
    list.findIndex((b) => isEqual(a, b)) === idx;

const isTheSameModule = (a: IModuleLike, b: IModuleLike): boolean =>
  a.name === b.name &&
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  (a.namespace === b.namespace || (!a.namespace && !b.namespace));

const reduceModules = (acc: Required<IModuleLike>[], module: IModuleLike) => {
  const idx = acc.findIndex((mod) => isTheSameModule(mod, module));
  if (idx === -1) {
    acc.push({
      name: module.name,
      namespace: module.namespace ?? '',
      hash: module.hash ?? '',
      imports: [],
    });
  } else {
    const mod = acc[idx];
    acc[idx] = {
      name: mod.name,
      namespace: mod.namespace,
      hash: mod.hash ?? module.hash,
      imports: [],
    };
  }
  return acc;
};

function getModulesFromSchemas(schemas?: ISchema[]): IModuleLike[] {
  if (!schemas) return [];
  return schemas.flatMap((schema) => {
    if (!schema.properties) return [];
    return schema.properties
      .filter(
        (prop) => typeof prop.type === 'object' && prop.type.kind === 'module',
      )
      .map((prop) => {
        const parts = (prop.type as IType).value.split('.');
        return {
          name: parts[parts.length - 1],
          namespace: parts.length === 2 ? parts[0] : '',
          imports: [],
          kind: 'interface',
        };
      });
  });
}

/**
 * @alpha
 */
export function contractParser(
  contract: string,
  namespace: string = '',
): [IModule[], IPointer] {
  const pointer = getPointer(contract);
  const result = parser(pointer);
  const tree = unwrapData(result);
  const { modules, namespaces, usedModules } = tree;

  const extModules =
    modules !== undefined
      ? modules.map(({ location, module: mod }) => {
          const modules = [
            ...(mod.usedModules ?? []),
            ...getUsedModules(location, usedModules),
            ...getUsedModulesInFunctions(mod.functions),
          ].reduce(reduceModules, []);
          return {
            ...mod,
            namespace: getNamespace(location, namespaces) || namespace,
            usedModules: modules,
            dependencies: [
              ...modules,
              ...getUsedInterfacesInFunctions(mod.functions),
              ...getModulesFromSchemas(mod.schemas),
              ...(mod.usedInterface?.map((usedInterface) => ({
                ...usedInterface,
                imports: [],
              })) ?? []),
            ]
              .reduce(reduceModules, [])
              .filter(
                ({ name, namespace: modNamespace }) =>
                  name !== mod.name && modNamespace !== namespace,
              ),
          };
        })
      : [];

  return [extModules, pointer];
}

const moduleLoader = (
  fetchModule: (moduleFullName: string) => Promise<string>,
) => {
  const storage = new Map<string, IModuleWithPointer>();

  const parseModule = (content: string, namespace?: string): void => {
    const [modules, pointer] = contractParser(content, namespace);
    modules.forEach((mod) => {
      storage.set(getModuleFullName(mod), { ...mod, pointer });
    });
  };

  const cache = new Map<string, Promise<string>>();
  const fetchContract = (name: string): Promise<string> => {
    if (cache.has(name)) return cache.get(name)!;
    const pr = fetchModule(name);
    cache.set(name, pr);
    return pr;
  };

  return {
    async getModule(moduleFullName: string) {
      const slugs = moduleFullName.split('.');
      const namespace = slugs.length === 2 ? slugs[0] : '';

      const mod = storage.get(moduleFullName);
      if (mod !== undefined) return mod;

      const content = await fetchContract(moduleFullName);
      if (content) {
        parseModule(content, namespace);
      }

      return storage.get(moduleFullName)!;
    },
    parserFile(content: string, namespace?: string) {
      parseModule(content, namespace);
    },
    getStorage() {
      return storage;
    },
  };
};

interface IModuleWithPointer extends IModule {
  pointer?: IPointer;
}

// parse a module and its dependencies
async function loadModuleDependencies(
  fullName: string,
  getModule: (name: string) => Promise<IModuleWithPointer | undefined>,
): Promise<Array<IModuleWithPointer>> {
  const module = await getModule(fullName);
  console.log(`Loading module ${fullName}`);
  // skip this module if its not available
  if (!module) return [];

  const interfaceOrModule = module.dependencies ?? [];

  const parentNamespace = module.namespace;

  const mods = [];

  for (const usedModule of interfaceOrModule) {
    if (
      typeof usedModule.namespace === 'string' &&
      usedModule.namespace !== ''
    ) {
      mods.push(
        await loadModuleDependencies(getModuleFullName(usedModule), getModule),
      );
      continue;
    }
    let moduleName: string;
    // console.log(`Loading module ${usedModule.name}`);
    const withParentNamespace = getModuleFullName({
      name: usedModule.name,
      namespace: parentNamespace,
    });

    try {
      // if the namespace is not defined, try to load the module with the parent namespace
      // this will store the module in the storage so we can use it later
      await getModule(withParentNamespace);
      moduleName = withParentNamespace;
      console.log('withParentNamespace', withParentNamespace);
    } catch {
      // if the module is not found, continue without a namespace
      moduleName = usedModule.name;
      if (withParentNamespace === moduleName) {
        console.log(`Module ${moduleName} not found. skipping`);
        continue;
      }
      console.log(
        `Module ${moduleName} not found. trying to load ${usedModule.name}`,
      );
    }
    if (moduleName !== fullName) {
      mods.push(await loadModuleDependencies(moduleName, getModule));
    }
  }
  const dependencies = mods.flat();

  return [module, ...dependencies].filter(isNotDuplicated(isTheSameModule));
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
  if (bodyPointer === undefined) return {};

  pointer.reset(bodyPointer);
  const blockPointer = getBlockPointer(pointer);
  const data = functionCalls(fnList, availableExternals)(blockPointer);

  return unwrapData(data);
};

// adding function calls to each function in the module
function addFunctionCalls(
  mod: IModule,
  allModule: Map<string, IModule>,
  pointer: IPointer,
): void {
  if (mod.kind !== 'module') return;

  const usedModules = mod.dependencies;
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
): void {
  if (mod.kind !== 'module' || !mod.functions) return;
  mod.functions.forEach((fun) => {
    fun.allExtractedCaps = getCapabilities(
      allModule,
      getModuleFullName(mod),
      fun.name,
    );
  });
}

/**
 * @alpha
 */
export async function pactParser({
  contractNames,
  files,
  getContract,
  namespace,
}: {
  contractNames?: string[];
  files?: string[];
  getContract: (fullName: string) => Promise<string>;
  namespace?: string;
}): Promise<{ [k: string]: IModule }> {
  const loader = moduleLoader(getContract);

  // parse files if presented
  if (files !== undefined) {
    files.forEach((content) => {
      loader.parserFile(content, namespace);
    });
  }

  // fetch and parse contracts by name if presented
  if (contractNames !== undefined) {
    await Promise.all(
      contractNames.map((contract) => {
        return loader.getModule(contract);
      }),
    );
  }

  const parsedModules = loader.getStorage();

  if (parsedModules.size === 0) {
    throw new Error('NO_MODULE_LOADED');
  }

  // load all dependencies
  for (const name of parsedModules.keys()) {
    await loadModuleDependencies(name, loader.getModule);
  }

  console.log('All modules are loaded');

  const allModules = loader.getStorage();

  allModules.forEach((mod) => {
    addFunctionCalls(mod, allModules, mod.pointer!);
    delete mod.pointer;
  });

  allModules.forEach((mod) => {
    addFunctionCapabilities(mod, allModules);
  });

  return Object.fromEntries(allModules);
}
