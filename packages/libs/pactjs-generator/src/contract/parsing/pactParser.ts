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

export interface IPactTree {
  namespace?: string[];
  module?: Array<{
    name: string;
    doc: string;
    governance: string;
    usedModules?: Array<{ name: string; hash?: string }>;
    usedInterface?: string[];
    functions?: IFunction[];
    capabilities?: ICapability[];
    schemas?: ISchema[];
  }>;
}

// :string :object{schema-one} {kind:string,value:string} | string
const typeRule = seq(
  id(':'),
  oneOf(
    // type
    seq($('kind', atom), id('{'), $('value', dotedAtom), id('}')),
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

// (module name governance) @doc "doc"
const moduleRule = block(
  // module
  id('module'),
  $('name', atom),
  $('governance', oneOf(atom, str, asString(block()))),
  maybe(id('@doc')),
  maybe($('doc', str)),
  maybe(seq(id('@model'), id('['), repeat(block()), id(']'))),
  repeat(
    $('functions', method('defun', functionBody)),
    $('capabilities', method('defcap', capabilityBody)),
    block(
      id('use'),
      $('usedModules', seq($('name', atom), $('hash', maybe(str)))),
    ),
    block(id('implements'), $('usedInterface', atom)),
    $('schemas', schema),
    // skip other type of blocks
    block(),
  ),
);

export const parser = repeat(
  // file level components
  block(id('namespace'), $('namespace', str)),
  $('module', moduleRule),
);

const functionCall = (fns: string[], modules: string[]) =>
  repeat(
    $('internal', seq(id('('), $(ids(fns)))),
    $('external', seq(id('('), $(asString(seq(ids(modules), id('.'), atom))))),
    // if token is not match skip it and check the next one
    skipToken,
  );

const getFunctionCalls = (
  fun: any,
  pointer: IPointer,
  fnList: string[],
  usedModules: string[],
): { internal?: string[]; external?: string[] } => {
  if (fun.bodyPointer !== undefined) {
    pointer.reset(fun.bodyPointer);
    const blockPointer = getBlockPointer(pointer);
    const data = functionCall(fnList, usedModules)(blockPointer);
    if (data !== FAILED) {
      return unwrapData(data);
    }
  }

  return {};
};

export function pactParser(contract: string): IPactTree {
  const pointer = getPointer(contract);
  const result = parser(pointer);
  if (result === FAILED) {
    console.error('there is no rule match with this token', pointer.next());
    throw new Error('parsing error');
  }
  const tree = unwrapData(result);
  // adding function calls to the tree
  tree?.module?.forEach((mod) => {
    if (!mod?.functions) return;
    const fnList: string[] = mod.functions
      .map(({ name }) => name!)
      .filter(Boolean);
    const usedModules = mod.usedModules
      ? mod.usedModules.map(({ name }) => name)
      : [];
    mod.functions.forEach((fun) => {
      (fun as any).functionCalls = getFunctionCalls(
        fun,
        pointer,
        fnList,
        usedModules,
      );
      delete (fun as any).bodyPointer;
    });
  });

  return tree;
}
