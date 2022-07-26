import { PathLike, readFileSync } from 'fs';
import byline from 'byline';
import { Defun, getModuleAndMethods, Output } from './parser';

interface IContractDefinition {
  get modules(): string[] | undefined;
  getMethods(moduleName: string): Record<string, Defun> | undefined;
}

export class FileContractDefinition implements IContractDefinition {
  bylineStream: byline.LineStream | undefined;
  raw: Output | undefined;

  constructor(
    private filePath: PathLike,
    private logger: (msg: any, ...args: any[]) => void = () => {},
  ) {
    this.parse();
  }

  private parse(): void {
    this.raw = getModuleAndMethods(
      readFileSync(this.filePath, 'utf8'),
      this.logger,
    );
  }

  get modules() {
    return this.raw ? Object.keys(this.raw) : undefined;
  }

  getMethods(moduleName: string) {
    return this.raw ? this.raw[moduleName].defuns : undefined;
  }
}

export class StringContractDefinition implements IContractDefinition {
  raw: Output | undefined;
  constructor(
    private contract: string,
    private logger: (msg: any, ...args: any[]) => void = () => {},
  ) {
    this.parse();
  }

  private parse(): void {
    this.raw = getModuleAndMethods(this.contract, this.logger);
  }

  get modules(): string[] | undefined {
    return this.raw ? Object.keys(this.raw) : undefined;
  }
  getMethods(moduleName: string): Record<string, Defun> | undefined {
    return this.raw ? this.raw[moduleName].defuns : undefined;
  }
}

export class PactTypescriptGenerator {
  constructor(...args: IContractDefinition[]) {}
}
