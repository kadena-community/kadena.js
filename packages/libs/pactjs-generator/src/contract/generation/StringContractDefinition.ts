import { ILogger } from '../parsing/lexer';
import { Defcap, Defun, Output, parser } from '../parsing/parser';

import { IContractDefinition } from './IContractDefinition';

/**
 * @alpha
 */

export class StringContractDefinition implements IContractDefinition {
  private _raw: Output;
  private _contract: string;
  private _logger: ILogger;

  public constructor(
    contract: string,
    namespace: string = '',
    logger: ILogger = () => {},
  ) {
    this._contract = contract;
    this._logger = logger;
    this._raw = parser(this._contract, this._logger);

    this._setNamespace(namespace);
  }

  private _setNamespace(namespace: string): void {
    if (!namespace) return;

    Object.keys(this._raw).forEach((module) => {
      this._raw[module].namespace = namespace;
    });
  }

  public getCapabilities(
    moduleName: string,
  ): Record<string, Defcap> | undefined {
    return this._raw[moduleName].defcaps;
  }

  public get modules(): string[] | undefined {
    return Object.keys(this._raw);
  }

  public getMethods(moduleName: string): Record<string, Defun> | undefined {
    return this._raw[moduleName].defuns;
  }

  public getNamespace(moduleName: string): string {
    return this._raw[moduleName].namespace;
  }

  public get modulesWithFunctions(): Output {
    return this._raw;
  }
}
