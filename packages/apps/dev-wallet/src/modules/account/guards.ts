// packages/apps/graph/src/graph/types/guard.ts

import { BuiltInPredicate } from '@kadena/client';

export type PvString = string;

export type PvInteger = { int: number | string };

export type PvDecimal = number | { decimal: string };

export type PvBool = boolean;

export type PvLiteral = PvString | PvInteger | PvDecimal | PvBool;

export type ModuleName = {
  name: string;
  namespace?: string;
};

export type PvModRef = {
  refName: string;
  refSpec: ModuleName[];
};

export type PvTime = { time: string } | { timep: string };

export type PvCapToken = {
  ctName: string;
  ctArgs: PactValue[];
};

export type PactValue =
  | PvLiteral
  | PvList
  | PvGuard
  | PvObject
  | PvModRef
  | PvTime
  | PvCapToken;

export type PvList = PactValue[];

export type PvGuard = Guard;

export type PvObject = { [key: string]: PactValue };

export type KeysetGuard = {
  keys: string[];
  pred: BuiltInPredicate;
};

export type KeysetRefGuard = {
  keysetref:
    | string
    | {
        ns?: string;
        ksn: string;
      };
};

export type UserGuard = {
  fun: string;
  args: PactValue[];
};

export type CapabilityGuard = {
  cgName: string;
  cgArgs: PactValue[];
  cgPactId?: string;
};

export type ModuleGuard = {
  moduleName: ModuleName;
  name: string;
};

export type PactGuard = {
  pactId: string;
  name: string;
};

export type Guard =
  | KeysetGuard
  | KeysetRefGuard
  | UserGuard
  | CapabilityGuard
  | ModuleGuard
  | PactGuard;

export function isKeysetGuard(guard: Guard): guard is KeysetGuard {
  return !!guard && (guard as KeysetGuard).keys !== undefined;
}

export function isKeysetRefGuard(guard: Guard): guard is KeysetRefGuard {
  return !!guard && (guard as KeysetRefGuard).keysetref !== undefined;
}

export function isUserGuard(guard: Guard): guard is UserGuard {
  return !!guard && (guard as UserGuard).fun !== undefined;
}

export function isCapabilityGuard(guard: Guard): guard is CapabilityGuard {
  return !!guard && (guard as CapabilityGuard).cgName !== undefined;
}

export function isModuleGuard(guard: Guard): guard is ModuleGuard {
  return !!guard && (guard as ModuleGuard).moduleName !== undefined;
}

export function isPactGuard(guard: Guard): guard is PactGuard {
  return !!guard && (guard as PactGuard).pactId !== undefined;
}
