/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @rushstack/typedef-var */

import { unwrapData } from './utils/dataWrapper';
import { getBlockPointer, getPointer, IPointer } from './utils/getPointer';
import {
  $,
  asString,
  atom,
  block,
  dotedAtom,
  FAILED,
  id,
  ids,
  IParser,
  maybe,
  oneOf,
  pointerSnapshot,
  repeat,
  seq,
  skipTheRest,
  skipToken,
  str,
} from './utils/parserUtilities';

interface ISchema {
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

interface IFunction extends IMethod {
  requiredCapabilities?: string[];
  withCapabilities?: string[];
  functionCalls?: {
    internal: string[];
    external: string[];
  };
}

interface ICapability extends IMethod {
  composeCapabilities?: string[];
}

interface IModule {
  namespace: string;
  name: string;
  doc: string;
  governance: string;
  usedModules?: Array<{ name: string; namespace?: string; hash?: string }>;
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

// :string :object{schema-one} {kind:string,value:string} | string
const typeRule = seq(
  id(':'),
  oneOf(
    // types with interface/schema
    seq($('kind', atom), id('{'), $('value', oneOf(dotedAtom, atom)), id('}')),
    // primary types
    $(atom),
  ),
);

// (defun|defcap name (a:string,b:object{schema-one},c) @doc "test doc")
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const method = <T extends IParser>(
  type: 'defun' | 'defcap',
  bodyParser: T = skipTheRest as T,
) =>
  block(
    id(type),
    $('name', atom),
    maybe($('returnType', typeRule)),
    block(
      maybe(
        repeat(
          $('parameters', seq($('name', atom), $('type', maybe(typeRule)))),
        ),
      ),
    ),
    maybe(id('@doc')),
    maybe($('doc', str)),
    bodyParser,
  );

// \@managed property manager | \@managed
const managed = oneOf(
  seq(id('@managed'), $('property', atom), $('manager', atom)),
  id('@managed', true),
);

// .... (compose-capability CAP)
const capabilityBody = seq(
  maybe($('managed', managed)),
  repeat(
    $('composedCapabilities', seq(id('compose-capability'), id('('), $(atom))),
    skipToken,
  ),
);

const functionBody = seq(
  // add the pointer index to the output in order to refer to that to determine all function calls
  $('bodyPointer', pointerSnapshot),
  repeat(
    $('requiredCapabilities', seq(id('require-capability'), id('('), $(atom))),
    $('withCapabilities', seq(id('with-capability'), id('('), $(atom))),
    $('moduleCalls', seq(id('('), dotedAtom)),
    skipToken,
  ),
);

const schema = block(
  // defschema
  id('defschema'),
  $('name', atom),
  maybe(id('@doc')),
  maybe($('doc', str)),
  repeat($('properties', seq($('name', atom), $('type', typeRule)))),
);

const use = block(
  id('use'),
  seq(
    oneOf(
      // namespace.module
      seq($('namespace', atom), id('.'), $('name', atom)),
      // module
      $('name', atom),
    ),
    $('hash', maybe(str)),
    $('imports', maybe(seq(id('['), repeat($(atom)), id(']')))),
  ),
);

const implementsRule = block(
  id('implements'),
  oneOf(
    // namespace.interface
    seq($('namespace', atom), id('.'), $('name', atom)),
    // interface
    $('name', atom),
  ),
);

// (module name governance) @doc "doc"
const moduleRule = block(
  // module
  $('kind', id('module') as IParser<string>),
  $('name', atom),
  $('governance', oneOf(atom, str, asString(block()))),
  maybe(id('@doc')),
  maybe($('doc', str)),
  maybe(seq(id('@model'), id('['), repeat(block()), id(']'))),
  repeat(
    $('functions', method('defun', functionBody)),
    $('capabilities', method('defcap', capabilityBody)),
    $('usedModules', use),
    $('usedInterface', implementsRule),
    $('schemas', schema),
    // skip other type of blocks
    block(),
  ),
);

const interfaceRule = block(
  // module
  $('kind', id('interface') as IParser<string>),
  $('name', atom),
  maybe(id('@doc')),
  maybe($('doc', str)),
  maybe(seq(id('@model'), id('['), repeat(block()), id(']'))),
  repeat(
    $('functions', method('defun', functionBody)),
    $('capabilities', method('defcap', capabilityBody)),
    $('usedModules', use),
    $('usedInterface', implementsRule),
    $('schemas', schema),
    // skip other type of blocks
    block(),
  ),
);

const addLocation = $('location', pointerSnapshot);

const parser = repeat(
  // file level components
  $('namespaces', block(addLocation, id('namespace'), $('name', str))),
  $('usedModules', seq(addLocation, use)),
  $('modules', seq(addLocation, $('module', oneOf(moduleRule, interfaceRule)))),
);

const functionCall = (fns: string[]) =>
  repeat(
    $('internal', seq(id('('), $(ids(fns)))),
    // TODO: this is not correct we need to somehow check the function in a used module - use module - also use might come with namespace
    // $('external', seq(id('('), $(asString(seq(ids(modules), id('.'), atom))))),
    // $(
    //   'external',
    //   oneOf(
    //     // namespace.module.function
    //     seq(
    //       $('namespace', atom),
    //       id('.'),
    //       $('module', atom),
    //       id('.'),
    //       $('func', atom),
    //     ),
    //     // module.function
    //     seq($('module', atom), id('.'), $('func', atom)),
    //   ),
    // ),
    // if token is not match skip it and check the next one
    skipToken,
  );

const getFunctionCalls = (
  fun: any,
  pointer: IPointer,
  fnList: string[],
): {
  internal?: string[];
  external?: Array<{ namespace?: string; module: string; func: string }>;
} => {
  if (fun.bodyPointer !== undefined) {
    pointer.reset(fun.bodyPointer);
    const blockPointer = getBlockPointer(pointer);
    const data = functionCall(fnList)(blockPointer);
    if (data !== FAILED) {
      return unwrapData(data);
    }
  }

  return {};
};

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

function fileParser(contract: string, namespace: string = ''): IModule[] {
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
      ],
    })) || [];

  extModules.forEach((mod) => {
    if (!mod?.functions) return;
    const hasModule = (ext: { namespace?: string; name: string }) => {
      if (mod.usedModules) {
        return Boolean(
          mod.usedModules.find(
            (m) => m.name === ext.name && m.namespace === ext.namespace,
          ),
        );
      }
      return false;
    };
    const fnList: string[] = mod.functions
      .map(({ name }) => name!)
      .filter(Boolean);
    mod.functions.forEach((fun) => {
      const functionCalls = getFunctionCalls(fun, pointer, fnList);
      if (functionCalls.external) {
        const usedModulesInTheFun = functionCalls.external
          .filter(
            ({ namespace, module: name }) => !hasModule({ namespace, name }),
          )
          .map(({ namespace, module: name }) => ({
            namespace: namespace || '',
            name,
          }));
        mod.usedModules = [...mod.usedModules, ...usedModulesInTheFun];
      }
      (fun as any).functionCalls = functionCalls;
    });
  });

  return extModules;
}

const getModuleFullName = (mod: { name: string; namespace?: string }) =>
  mod.namespace ? `${mod.namespace}.${mod.name}` : mod.name;

async function parserAllModules(
  mainContract: string,
  getContract: (name: string) => Promise<string>,
  allModules: Record<string, IModule | null> = {},
  namespace?: string,
): Promise<Record<string, IModule | null>> {
  const modules = fileParser(mainContract, namespace);
  await Promise.all(
    modules.map(async (mod) => {
      const fullName = getModuleFullName(mod);
      allModules[fullName] = mod;
      const interfaceOrModule = [
        ...(mod.usedModules || []),
        ...(mod.usedInterface || []),
      ];
      if (interfaceOrModule.length === 0) return;
      await Promise.all(
        interfaceOrModule.map(async (usedModule) => {
          const name = getModuleFullName(usedModule);
          if (allModules[name] === undefined) {
            // parsing is in progress
            allModules[name] = null;
            const content = await getContract(name);
            if (content) {
              await parserAllModules(
                content,
                getContract,
                allModules,
                usedModule.namespace,
              );
            } else {
              delete allModules[name];
            }
          }
        }),
      );
    }),
  );
  return allModules;
}

export async function pactParser(
  mainContract: string,
  getContract: (fullName: string) => Promise<string>,
  namespace: string = '',
) {
  const modules = await parserAllModules(
    mainContract,
    getContract,
    {},
    namespace,
  );
  return modules;
  // TODO: complete function and capability list
}
