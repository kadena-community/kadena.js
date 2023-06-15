import { IFunction, IModule } from '../parsing/pactParser';
import { getModuleFullName } from '../parsing/utils/utils';

import { EOL } from 'os';

const keywordsMap: Record<string, string> = {
  decimal: 'IPactDecimal',
  integer: 'IPactInt',
  time: 'Date',
  bool: 'boolean',
  guard: '() => string',
};

const mapType = (name: string | 'undefined'): string => {
  if (name === 'undefined') {
    return 'any';
  }
  if (name in keywordsMap) {
    return keywordsMap[name];
  }
  // TODO: add automatic type mapping for other types (like object{fungible-v2....})
  return name;
};

const getFuncCapInterfaceName = (func: IFunction): string => {
  if (
    func.allExtractedCaps === undefined ||
    func.allExtractedCaps.length === 0
  ) {
    return '';
  }

  return `ICapability_${func.name.replace(/-/g, '_')}`;
};

const indent = (str: string): string =>
  str
    .split(EOL)
    .map((line) => `  ${line}`)
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
    return `${arg.name.replace(/-/g, '')}: ${mapType(
      // TODO: create a type based on the schema in the contract
      typeof arg.type === 'string' ? arg.type : 'object',
    )}`;
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
    let parameters = [
      `cap: "${cap.fullModuleName}.${cap.name}"`,
      `signer: string`,
    ];
    if (cap.capability.parameters) {
      const args = getParameters(cap.capability.parameters);
      parameters = [...parameters, ...args];
    }
    const comment =
      cap.capability.doc !== undefined
        ? `/**${EOL}* ${cap.capability.doc}${EOL}*/`
        : '';
    const addCap = `addCap(${EOL}${parameters
      .map(indent)
      .join(`, ${EOL}`)}): this`;
    return { comment, addCap };
  });

  const capStr = cap.map((c) => `${c.comment}${EOL}${c.addCap},`).join(EOL);
  return `interface ${interfaceName} {${EOL}${indent(capStr)}${EOL}}`;
}

const getFunctionType = (func: IFunction): string => {
  const capInterfaceName = getFuncCapInterfaceName(func) || 'ICapV2';
  const comment =
    func.doc !== undefined ? `/**${EOL}* ${func.doc}${EOL}*/${EOL}` : '';

  const parameters = getParameters(func.parameters);
  const lnBreak = parameters.length > 1;
  const nl = lnBreak ? EOL : '';
  return indent(
    `${comment}"${func.name}": (${nl}${parameters
      .map((d) => (lnBreak ? indent(d) : d))
      .join(`,${nl}`)}) => Builder<${capInterfaceName}>`,
  );
};

/**
 * @alpha
 */
export function generateDts2(
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

  const capsInterfaces =
    module.functions?.map(genFunCapsInterface).filter(Boolean).join(EOL) || '';

  const dts = `
import type { ICommandBuilderV2, IPactCommand, ICapV2 } from '@kadena/client';
import type { IPactDecimal, IPactInt } from '@kadena/types';

interface ICapability_Coin_GAS {
  addCap(
    cap: "coin.GAS",
    signer: string
  ): this
}

${capsInterfaces}

type Builder<T> = ICommandBuilderV2 & ICapability_Coin_GAS & T

declare module '@kadena/client' {

  export interface IPactModules {
    ${module.doc ? `/**${EOL}* ${module.doc}${EOL}*/${EOL}` : ''}
    "${getModuleFullName(module)}": {
${indent(indent(module.functions.map(getFunctionType).join(`,${EOL}${EOL}`)))}
    }
  }
}`;
  return dts;
}
