/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/*
 * Pact types
 *
 * https://gist.github.com/jmcardon/4290533dc950fe49ebe5c4feee342ba0
 */

/** @public */
export type ModuleName = { name: string; namespace?: string };
/** @public */
export type PvInteger = { int: number | string };
/** @public */
export type PvDecimal = number | { decimal: string };
/** @public */
export type PvLiteral = string | PvInteger | PvDecimal | boolean;
/** @public */
export type PvList = PactValue[];
/** @public */
export type PvObject = { [key: string]: PactValue };
/** @public */
export type PvModRef = { refName: string; refSpec: ModuleName[] };
/** @public */
export type PvTime = { time: string } | { timep: string };
/** @public */
export type PvCapToken = { ctName: string; ctArgs: PactValue[] };
/** @public */
export type PactValue =
  | PvLiteral
  | PvList
  | Guard
  | PvObject
  | PvModRef
  | PvTime
  | PvCapToken;

/** @public */
export type KeySet = {
  keys: string[];
  pred: string;
};

/** @public */
export type KeySetRef = {
  keysetref: {
    ns?: string;
    ksn: string;
  };
};

/** @public */
export type UserGuard = {
  fun: string;
  args: PactValue[];
};

/** @public */
export type CapabilityGuard = {
  cgName: string;
  cgArgs: PactValue[];
  cgPactId?: string;
};

/** @public */
export type ModuleGuard = {
  moduleName: ModuleName;
  name: string;
};

/** @public */
export type PactGuard = {
  pactId: string;
  name: string;
};

/** @public */
export type Guard =
  | KeySet
  | KeySetRef
  | UserGuard
  | CapabilityGuard
  | ModuleGuard
  | PactGuard;

/** @public */
export const isKeySetGuard = (guard: Guard): guard is KeySet => {
  return 'keys' in guard && 'pred' in guard;
};

/** @public */
export const isKeySetRefGuard = (guard: Guard): guard is KeySetRef => {
  return 'keysetref' in guard;
};

/** @public */
export const isUserGuard = (guard: Guard): guard is UserGuard => {
  return 'fun' in guard && 'args' in guard;
};

/** @public */
export const isCapabilityGuard = (guard: Guard): guard is CapabilityGuard => {
  return 'cgName' in guard && 'cgArgs' in guard;
};

/** @public */
export const isModuleGuard = (guard: Guard): guard is ModuleGuard => {
  return 'moduleName' in guard && 'name' in guard;
};

/** @public */
export const isPactGuard = (guard: Guard): guard is PactGuard => {
  return 'pactId' in guard && 'name' in guard;
};
