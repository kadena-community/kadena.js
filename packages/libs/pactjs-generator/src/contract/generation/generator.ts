import { EOL } from 'os';
import type { IFunction, IModule, IType } from '../parsing/pactParser';
import { getModuleFullName, trim } from '../parsing/utils/utils';

const keywordsMap: Record<string, string> = {
  decimal: 'IPactDecimal',
  integer: 'IPactInt',
  string: 'string',
  time: 'Date',
  bool: 'boolean',
  guard: 'PactReference',
  object: 'object',
};

const mapType = (inputType?: string | IType): string => {
  if (inputType === undefined) {
    return 'any';
  }
  if (typeof inputType === 'string') {
    return keywordsMap[inputType] ?? 'any';
  }
  if (typeof inputType === 'object' && inputType.kind === 'module')
    return 'PactReference';
  const isList = inputType.isList ? '[]' : '';
  // TODO: import the schema as interface to return kind instead of any
  const type = keywordsMap[inputType.kind] ?? 'any';
  return `${type}${isList}`;
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
  isCapability = false,
): string[] => {
  if (!list) return [];
  return list.map((arg) => {
    let argType = mapType(arg.type);
    if (isCapability && argType === 'PactReference') {
      argType = 'string | object';
    }
    if (!isCapability && argType !== 'PactReference' && argType !== 'any') {
      argType = `${argType} | PactReference`;
    }
    return `${arg.name.replace(/-/g, '')}: ${argType}`;
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
    let capabilityName = 'capabilityName';
    while (
      cap.capability.parameters &&
      cap.capability.parameters.find((p) => p.name === capabilityName)
    ) {
      // make sure we don't have a name collision
      capabilityName = `_${capabilityName}`;
    }

    let parameters = [`${capabilityName}: "${cap.fullModuleName}.${cap.name}"`];
    if (cap.capability.parameters) {
      const args = getParameters(cap.capability.parameters, true);
      parameters = [...parameters, ...args];
    }
    const comment =
      cap.capability.doc !== undefined
        ? `/**${EOL}* ${cap.capability.doc}${EOL}*/`
        : '';
    const addCap = `(${parameters.join(',')}): ICap`;
    return { comment, addCap };
  });

  const capStr = cap.map((c) => `${c.comment}${EOL}${c.addCap},`).join(EOL);
  return `interface ${interfaceName} {${capStr}}`;
}

const asDocComment = (doc?: string): string => {
  if (!doc) return '';
  return `/**${EOL}${doc
    .split(EOL)
    .filter(Boolean)
    // trim backslashes and all spaces
    .map((line) => `* ${trim(line.trim(), '\\')}`)
    .join(EOL)}${EOL}*/`;
};

const getFunctionType = (func: IFunction): string => {
  const capInterfaceName = getFuncCapInterfaceName(func) || '';
  const comment =
    func.doc !== undefined ? `${asDocComment(func.doc)}${EOL}` : '';

  const parameters = getParameters(func.parameters, false);
  const caps = capInterfaceName
    ? `${capInterfaceName} & ICommonCapabilities`
    : 'ICommonCapabilities';
  return `${comment}"${func.name}": (${parameters.join(
    ',',
  )}) => string & { capability : ${caps}; returnType : ${mapType(
    func.returnType,
  )}} `;
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
import type { PactReference } from '@kadena/client';
import type { IPactDecimal, IPactInt, ICap } from '@kadena/types';

interface ICommonCapabilities {
  (name: 'coin.GAS'): ICap;
  // let users use any other capabilities that can not be inferred
  (name: string, ...args: any[]): ICap;
}
${capsInterfaces ? `${EOL}${capsInterfaces}${EOL}` : ''}
declare module '@kadena/client' {
  interface IPactModules {
    ${asDocComment(module.doc)}
    "${getModuleFullName(module)}": {
${functions.map(getFunctionType).join(`,${EOL}${EOL}`)}
${
  defpacts.length > 0
    ? `
      "defpact":{
${defpacts.map(getFunctionType).join(`,${EOL}${EOL}`)}
      }`
    : ''
}
    }
  }
}`;
  return dts;
}
