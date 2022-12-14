import { Arg, Defcap, Defun, Module, Output } from '../parsing/parser';

const keywordsMap: Record<string, string> = {
  decimal: 'number',
  integer: 'number',
  time: 'Date',
  bool: 'boolean',
  guard: 'Function',
  'object{fungible-v2.account-details}': 'object',
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

type ModuleName = string;

function capitalize([first, ...rest]: string): string {
  return first.toUpperCase() + rest.join('');
}

function camelCase(name: string[]): string {
  return name.map(capitalize).join('');
}

function stripDashesAndCamelCase(name: string): string {
  return camelCase(name.split('-'));
}

function generateModuleName(module: Module): string {
  if (module.namespace.length === 0) {
    return module.name;
  } else {
    return `${module.namespace}.${module.name}`;
  }
}

/**
 * @alpha
 */
export function generateDts(modules: Output): Map<ModuleName, string> {
  const moduleDtss: Map<ModuleName, string> = new Map<ModuleName, string>();
  for (const ModuleName in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, ModuleName)) {
      const module: Module = modules[ModuleName];
      moduleDtss.set(
        ModuleName,
        `
import type { ICommandBuilder, IPactCommand } from '@kadena/client';

declare module '@kadena/client' {
  export type I${stripDashesAndCamelCase(module.name)}Caps = {
    ${Object.keys(module.defcaps)
      .map((defcapName) => {
        const defcap: Defcap = module.defcaps[defcapName];
        return `"${module.name}.${defcapName}": [ ${Object.keys(defcap.args)
          .map((argName) => {
            const defcapArg: Arg = defcap.args[argName];
            return `${argName.replace(/-/g, '')}: ${mapType(defcapArg.type)}`;
          })
          .join(', ')} ]`;
      })
      .join(', \n')}
  }
  export interface IPactModules {
    "${generateModuleName(module)}": {
       ${Object.keys(module.defuns)
         .map((defun) => {
           const fnc: Defun = module.defuns[defun];
           return `"${fnc.method}": (${Object.keys(fnc.args)
             .map((arg) => {
               const argDef: Arg = fnc.args[arg];
               return `${argDef.name.replace(/-/, '_')}: ${mapType(
                 argDef.type,
               )}`;
             })
             .join(', ')}) => ICommandBuilder<I${stripDashesAndCamelCase(
             module.name,
           )}Caps> & IPactCommand`;
         })
         .join(',\n')}
    }
  }
}`,
      );
    }
  }
  return moduleDtss;
}
