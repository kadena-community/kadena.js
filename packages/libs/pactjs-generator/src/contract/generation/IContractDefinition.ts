import { Defcap, Defun, Output } from '../parsing/parser';

/**
 * @alpha
 */
export interface IContractDefinition {
  get modules(): string[] | undefined;
  getMethods(moduleName: string): Record<string, Defun> | undefined;
  getCapabilities(moduleName: string): Record<string, Defcap> | undefined;
  get modulesWithFunctions(): Output;
  getNamespace(moduleName: string): string;
}
