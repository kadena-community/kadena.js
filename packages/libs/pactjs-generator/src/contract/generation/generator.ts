import { IFunction, IModule } from '../parsing/pactParser';
import { getModuleFullName } from '../parsing/utils/utils';

import { EOL } from 'os';

const keywordsMap: Record<string, string> = {
  decimal: 'IPactDecimal',
  integer: 'IPactInt',
  string: 'string',
  time: 'Date',
  bool: 'boolean',
  guard: 'PactReference',
  object: 'object',
};

const mapType = (
  inputType?: string | { kind: string; value: string },
): string => {
  if (inputType === undefined) {
    return 'any';
  }
  if (typeof inputType === 'string') {
    return keywordsMap[inputType] ?? 'any';
  }

  if (typeof inputType === 'object' && inputType.kind === 'module')
    return 'PactReference';
  // TODO: import the schema as interface to return kind instead of any
  // return inputType.kind;
  return keywordsMap[inputType.kind] ?? 'any';
};

const getFuncCapInterfaceName = (func: IFunction): string => {
  if (
    func.allExtractedCaps === undefined ||
    func.allExtractedCaps.length === 0
  ) {
    return '';
  }

  const prefix = func.kind === 'defpact' ? 'defpact_' : '';

  return `ICapability_${prefix}${func.name.replace(/-/g, '_')}`;
};

const indent = (str: string, depth = 1): string =>
  str
    .split(EOL)
    .map((line) => `${' '.repeat(depth * 2)}${line}`)
    .join(EOL);

const getParameters = (
  list?: Array<{
    name: string;
    type:
      | string
      | {
          kind: string;
          value: string;
        };
  }>,
): string[] => {
  if (!list) return [];
  return list.map((arg) => {
    return `${arg.name.replace(/-/g, '')}: ${mapType(arg.type)}`;
  });
};

function genFunCapsInterface(func: IFunction): string {
  if (
    func.allExtractedCaps === undefined ||
    func.allExtractedCaps.length === 0
  ) {
    return '';
  }
  const interfaceName = getFuncCapInterfaceName(func);

  const cap = func.allExtractedCaps.map((cap) => {
    let parameters = [`name: "${cap.fullModuleName}.${cap.name}"`];
    if (cap.capability.parameters) {
      const args = getParameters(cap.capability.parameters);
      parameters = [...parameters, ...args];
    }
    const comment =
      cap.capability.doc !== undefined
        ? `/**${EOL}* ${cap.capability.doc}${EOL}*/`
        : '';
    const addCap = `(${EOL}${parameters
      .map((line) => indent(line))
      .join(`, ${EOL}`)}): ICap`;
    return { comment, addCap };
  });

  const capStr = cap.map((c) => `${c.comment}${EOL}${c.addCap},`).join(EOL);
  return `interface ${interfaceName} {${EOL}${indent(capStr)}${EOL}}`;
}

const getFunctionType = (func: IFunction): string => {
  const capInterfaceName = getFuncCapInterfaceName(func) || '';
  const comment =
    func.doc !== undefined ? `/**${EOL}* ${func.doc}${EOL}*/${EOL}` : '';

  const parameters = getParameters(func.parameters);
  const lnBreak = parameters.length > 1;
  const nl = lnBreak ? EOL : '';
  const caps = capInterfaceName
    ? `${capInterfaceName} & ICapability_Coin_GAS`
    : 'ICapability_Coin_GAS';
  return indent(
    `${comment}"${func.name}": (${nl}${parameters
      .map((d) => (lnBreak ? indent(d) : d))
      .join(`,${nl}`)}) => string & { capability : ${caps}} `,
  );
};

/**
 * @alpha
 */
export function generateDts(
  moduleFullName: string,
  modules: Record<string, IModule>,
): string {
  const module = modules[moduleFullName];
  if (module === undefined) {
    throw new Error(`Module ${moduleFullName} not found`);
  }

  if (module.functions === undefined) {
    throw new Error(`Module ${moduleFullName} has no functions`);
  }

  const functions = module.functions.filter(({ kind }) => kind === 'defun');
  const defpacts = module.functions.filter(({ kind }) => kind === 'defpact');

  const capsInterfaces =
    module.functions
      ?.map(genFunCapsInterface)
      .filter(Boolean)
      .join(EOL.repeat(2)) || '';

  const dts = `
import type { IPactDecimal, IPactInt, ICap } from '@kadena/types';
import type { Literal } from '@kadena/client';

type PactReference = Literal | (() => string);

interface ICapability_Coin_GAS {
  (name: 'coin.GAS'): ICap;
}
${capsInterfaces ? `${EOL}${capsInterfaces}${EOL}` : ''}
declare module '@kadena/client' {
  export interface IPactModules {
    ${module.doc ? `/**${EOL}${indent(module.doc, 2)}${indent(EOL, 2)}*/` : ''}
    "${getModuleFullName(module)}": {
${indent(functions.map(getFunctionType).join(`,${EOL}${EOL}`), 2)}
${
  defpacts.length > 0
    ? `
      "defpact":{
${indent(defpacts.map(getFunctionType).join(`,${EOL}${EOL}`), 3)}
      }`
    : ''
}
    }
  }
}`;
  return dts;
}
