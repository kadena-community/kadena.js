import { getBlockPinter, getPointer, IPointer } from './utils/getPointer';
import {
  $,
  atom,
  block,
  dotedAtom,
  id,
  IParser,
  list,
  lookUp,
  maybe,
  oneOf,
  pointerSnapshot,
  seq,
  skipTheRest,
  str,
} from './utils/parserUtilities';

import { Token } from 'moo';

const typeRule = seq(
  id(':'),
  oneOf(seq($('kind', atom), id('{'), $('value', dotedAtom), id('}')), $(atom)),
);

const method = (
  type: 'defun' | 'defcap',
  bodyParser: IParser = skipTheRest,
): IParser =>
  block(
    id(type),
    $('name', atom),
    maybe($('returnValue', typeRule)),
    block(
      maybe(
        list($('parameters', seq($('name', atom), $('type', maybe(typeRule))))),
      ),
    ),
    maybe(id('@doc')),
    maybe($('doc', str)),
    bodyParser,
  );

const managed = oneOf(
  seq(id('@managed'), $('property', atom), $('manager', atom)),
  id('@managed', true),
);

const capabilityBody = seq(
  maybe($('managed', managed)),
  $('bodyPointer', pointerSnapshot),
  lookUp({ 'compose-capability': block($('noKey', atom)) }),
);

const functionBody = seq(
  $('bodyPointer', pointerSnapshot),
  lookUp({
    'required-capability': block($('noKey', atom)),
    'with-capability': block($('noKey', atom)),
  }),
);

const moduleRule = block(
  id('module'),
  $('name', atom),
  $('governance', atom),
  maybe(id('@doc')),
  maybe($('doc', str)),

  list(
    $('functions', method('defun', functionBody)),
    $('capabilities', method('defcap', capabilityBody)),
    block(id('use'), $('usedModule', atom)),
    block(id('implements'), $('usedInterface', atom)),
    // skip other type of block
    block(),
  ),
);

const parser: IParser = list(
  block(id('namespace'), $('namespace', str)),
  $('module', moduleRule),
);

const getFunctionCalls = (fun: any, pointer: IPointer, fnList: string[]) => {
  const callList: string[] = [];
  if (fun.bodyPointer) {
    pointer.reset(fun.bodyPointer);
    const blockPinter = getBlockPinter(pointer, 0);
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

export function pactParser(contract: string) {
  const pointer = getPointer(contract);
  const tree = parser(pointer);
  // adding function calls to the tree
  tree.module.forEach((mod: any) => {
    const fnList = mod.functions.map(({ name }: { name: string }) => name);
    mod.functions.forEach((fun: any) => {
      fun.functionCalls = getFunctionCalls(fun, pointer, fnList);
      delete fun.bodyPointer;
    });
  });

  return tree;
}
