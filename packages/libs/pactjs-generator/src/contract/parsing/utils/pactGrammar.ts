/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */
// In this module, we generate new functions by composing other functions. In order to allow TypeScript to automatically infer the types,
// I had to disable these rules.
import type { IWrappedData } from './dataWrapper';
import type { IParser } from './parser-utilities';
import {
  $,
  asString,
  atom,
  block,
  dotedAtom,
  id,
  ids,
  maybe,
  oneOf,
  pointerSnapshot,
  repeat,
  seq,
  skipTheRest,
  skipToken,
  str,
} from './parser-utilities';

const kind = oneOf(atom, id('module'));

const list = (rule: IParser) =>
  seq(
    $('isList', () => true),
    id('['),
    rule,
    id(']'),
  );
const typeItem = oneOf(
  // types with interface/schema
  seq($('kind', kind), id('{'), $('value', oneOf(dotedAtom, atom)), id('}')),
  // primary types
  $(atom),
);

// :string :object{schema-one} :[object{schema-one}] => {kind:object,value:schema-one} | string
export const typeRule = seq(id(':'), oneOf(list(typeItem), typeItem));

// (defun|defcap name (a:string,b:object{schema-one},c) @doc "test doc")
export const method = <T extends IParser>(
  type: 'defun' | 'defcap' | 'defpact',
  bodyParser: T = skipTheRest as T,
) =>
  block(
    $('kind', id(type)),
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
  // TODO: fix the issue with typing here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maybe($('managed', managed) as IParser<IWrappedData<any, 'managed'>>),
  repeat(
    $('composeCapabilities', seq(id('compose-capability'), id('('), $(atom))),
    skipToken,
  ),
);

const functionBody = seq(
  // add the pointer index to the output in order to refer to that to determine all function calls
  $('bodyPointer', pointerSnapshot),
  repeat(
    $('requiredCapabilities', seq(id('require-capability'), id('('), $(atom))),
    $('withCapabilities', seq(id('with-capability'), id('('), $(atom))),
    $(
      'externalFnCalls',
      seq(
        id('('),
        oneOf(
          // namespace.module.function
          seq(
            $('namespace', atom),
            id('.'),
            $('module', atom),
            id('.'),
            $('func', atom),
          ),
          // module.function
          seq($('module', atom), id('.'), $('func', atom)),
        ),
      ),
    ),
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
    maybe(seq(id('['), repeat($('imports', atom)), id(']'))),
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

export const defun = method('defun', functionBody);
export const defcap = method('defcap', capabilityBody);
export const defpact = method('defpact', functionBody);

// (module name governance @doc "doc" ... )
// (interface name @doc "doc" ... )
export const moduleRule = block(
  oneOf(
    seq(
      $('kind', id('module') as IParser<string>),
      $('name', atom),
      $('governance', oneOf(atom, str, asString(block()))),
    ),
    seq($('kind', id('interface') as IParser<string>), $('name', atom)),
  ),
  maybe(id('@doc')),
  maybe($('doc', str)),
  maybe(seq(id('@model'), id('['), repeat(block()), id(']'))),
  repeat(
    $('functions', oneOf(defun, defpact)),
    $('capabilities', defcap),
    $('usedModules', use),
    $('usedInterface', implementsRule),
    $('schemas', schema),
    // skip other type of blocks
    block(),
  ),
);

const addLocation = $('location', pointerSnapshot);

export const parser = repeat(
  $('namespaces', block(addLocation, id('namespace'), $('name', str))),
  $('usedModules', seq(addLocation, use)),
  $('modules', seq(addLocation, $('module', moduleRule))),
  // skip other type of blocks
  block(),
);

// use this function to get the list of all function calls inside a function
// we need to do this after parsing the whole file and dependencies and get the list of all functions
export const functionCalls = (
  internals: string[],
  externals: Array<{ namespace?: string; module: string; func: string }>,
) =>
  repeat(
    $('internal', seq(id('('), $(ids(internals)))),
    $(
      'external',
      seq(
        id('('),
        $(
          ids(
            externals.map(({ func }) => func),
            (idx) => externals[idx],
          ),
        ),
      ),
    ),
    skipToken,
  );
