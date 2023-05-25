/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @rushstack/typedef-var */

import { getBlockPointer, getPointer, IPointer } from './utils/getPointer';
import {
  $,
  atom,
  block,
  dotedAtom,
  FAILED,
  id,
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

import { Token } from 'moo';

// :string :object{schema-one} {kind:string,value:string} | string
const typeRule: IParser = seq(
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
  // lookUp({ 'compose-capability': block($('composedCapabilities', atom)) }),
  repeat(
    $('composedCapabilities', seq(id('compose-capability'), block($(atom)))),
    skipToken,
  ),
);

const functionBody = seq(
  // add the pointer index to the output in order to refer to that to determine all function calls
  $('bodyPointer', pointerSnapshot),
  // lookUp({
  //   'required-capability': block($('requiredCapabilities', atom)),
  //   'with-capability': block($('withCapabilities', atom)),
  // }),
  repeat(
    $('requiredCapabilities', seq(id('required-capability'), block($(atom)))),
    $('withCapabilities', seq(id('with-capability'), block($(atom)))),
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

const moduleRule = block(
  // module
  id('module'),
  $('name', atom),
  $('governance', atom),
  maybe(id('@doc')),
  maybe($('doc', str)),

  repeat(
    $('functions', method('defun', functionBody)),
    $('capabilities', method('defcap', capabilityBody)),
    block(id('use'), $('usedModule', atom)),
    block(id('implements'), $('usedInterface', atom)),
    $('schemas', schema),
    // skip other type of block
    block(),
  ),
);

export const parser = repeat(
  // file level components
  block(id('namespace'), $('namespace', str)),
  $('module', moduleRule),
);

const getFunctionCalls = (
  fun: any,
  pointer: IPointer,
  fnList: string[],
): string[] => {
  const callList: string[] = [];
  if (fun.bodyPointer) {
    pointer.reset(fun.bodyPointer);
    const blockPinter = getBlockPointer(pointer, 0);
    let token: Token | undefined = undefined;
    while ((token = blockPinter.next())) {
      if (
        token.type === 'atom' &&
        fnList.includes(token.value) &&
        token.value !== fun.name &&
        !callList.includes(token.value)
      ) {
        callList.push(token.value);
      }
    }
  }
  return callList;
};

export function pactParser(contract: string): IPactTree {
  const pointer = getPointer(contract);
  const tree = parser(pointer);
  if (tree === FAILED) {
    console.error('there is no rule match with this token', pointer.next());
    throw new Error('parsing error');
  }
  // adding function calls to the tree
  tree.module?.forEach((mod) => {
    if (!mod.functions) return;
    const fnList: string[] = mod.functions
      .map(({ name }) => name!)
      .filter(Boolean);
    mod.functions.forEach((fun) => {
      (fun as any).functionCalls = getFunctionCalls(fun, pointer, fnList);
      delete (fun as any).bodyPointer;
    });
  });

  return tree;
}

interface IMethod {
  name: string;
  returnType: string | { kind: string; value: string };
  doc: string;
  parameters?: Array<{
    name: string;
    type: string | { kind: string; value: string };
  }>;
}

interface IFunction extends IMethod {
  requiredCapabilities?: string[];
  withCapabilities?: string[];
  functionCalls?: string[];
}

interface ICapability extends IMethod {
  composeCapabilities?: string[];
}

export interface IPactTree {
  namespace?: string[];
  module?: Array<{
    name: string;
    doc: string;
    usedModules?: string[];
    usedInterface?: string[];
    functions?: IFunction[];
    capabilities?: ICapability[];
    schemas?: Array<{}>;
  }>;
}
