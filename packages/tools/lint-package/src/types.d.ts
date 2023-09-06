import type { PackageJson } from '@npmcli/package-json';

// TypeScript does not export `tsconfig.json` typings
export type TSConfig = {
  extends: string;
};

export interface RuleArg {
  file: string;
  dir: string;
  pkg: PackageJson;
  tsConfig: TSConfig;
  eslintConfig: string;
}

export type Severity = 'warn' | 'error';
export type Issue = [Severity, string];
export type Issues = Array<Issue>;

export type Rule = (options: RuleArg) => Issue[];

export type Rules = Rule[];
