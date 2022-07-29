import { Defun, getModuleAndMethods, ILogger, Output } from './lexer';

import { PathLike, readFileSync } from 'fs';

interface IContractDefinition {
  get modules(): string[] | undefined;
  getMethods(moduleName: string): Record<string, Defun> | undefined;
}

/**
 * @alpha
 */
export class FileContractDefinition implements IContractDefinition {
  private _filePath: PathLike;
  private _logger: ILogger;
  private _raw: Output;

  public constructor(filePath: PathLike, logger: ILogger = () => {}) {
    this._filePath = filePath;
    this._logger = logger;
    this._raw = getModuleAndMethods(
      readFileSync(this._filePath, 'utf8'),
      this._logger,
    );
  }

  public get modules(): string[] | undefined {
    return Object.keys(this._raw);
  }

  public getMethods(moduleName: string): Record<string, Defun> | undefined {
    return this._raw[moduleName].defuns;
  }
}

/**
 * @alpha
 */
export class StringContractDefinition implements IContractDefinition {
  private _raw: Output;
  private _contract: string;
  private _logger: ILogger;

  public constructor(contract: string, logger: ILogger = () => {}) {
    this._contract = contract;
    this._logger = logger;
    this._raw = getModuleAndMethods(this._contract, this._logger);
  }

  public get modules(): string[] | undefined {
    return Object.keys(this._raw);
  }

  public getMethods(moduleName: string): Record<string, Defun> | undefined {
    return this._raw[moduleName].defuns;
  }
}

/**
 * @alpha
 */
export class PactTypescriptGenerator {
  public constructor(...args: IContractDefinition[]) {}
}
