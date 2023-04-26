import { ILogger } from '../parsing/lexer';
import { Defcap, Defun, Output, parser } from '../parsing/parser';

import { IContractDefinition } from './IContractDefinition';

import { PathLike, readFileSync } from 'fs';

/**
 * @alpha
 */
export class FileContractDefinition implements IContractDefinition {
  private _path: PathLike;
  private _logger: ILogger;
  private _raw: Output;

  public constructor({
    path,
    namespace,
    logger = () => {},
  }: {
    path: PathLike;
    namespace?: string;
    logger?: ILogger;
  }) {
    this._path = path;
    this._logger = logger;
    this._raw = parser(readFileSync(this._path, 'utf8'), this._logger);

    this._setNamespace(namespace);
  }

  private _setNamespace(namespace?: string): void {
    if (namespace === undefined) return;

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

  public get modulesWithFunctions(): Output {
    return this._raw;
  }

  public getMethods(moduleName: string): Record<string, Defun> | undefined {
    return this._raw[moduleName].defuns;
  }

  public getNamespace(moduleName: string): string {
    return this._raw[moduleName].namespace;
  }
}
