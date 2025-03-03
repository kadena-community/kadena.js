import type { WALLETTYPES } from '@/constants';
import type { BuiltInPredicate, ChainId } from '@kadena/client';

export type PvString = string;

export interface PvInteger {
  int: number | string;
}

export type PvDecimal = number | { decimal: string };

export type PvBool = boolean;

export type PvLiteral = PvString | PvInteger | PvDecimal | PvBool;

export interface ModuleName {
  name: string;
  namespace?: string;
}

export interface PvModRef {
  refName: string;
  refSpec: ModuleName[];
}

export type PvTime = { time: string } | { timep: string };

export type PvList = PactValue[];

export type PvGuard = Guard;

export interface PvObject {
  [key: string]: PactValue;
}

export interface PvCapToken {
  ctName: string;
  ctArgs: PactValue[];
}

export type PactValue =
  | PvLiteral
  | PvList
  | PvGuard
  | PvObject
  | PvModRef
  | PvTime
  | PvCapToken;

export interface ModuleName {
  name: string;
  namespace?: string;
}

export interface KeysetGuard {
  keys: string[];
  pred: BuiltInPredicate;
}

export interface KeysetRefGuard {
  keysetref:
    | string
    | {
        ns?: string;
        ksn: string;
      };
}

export interface UserGuard {
  fun: string;
  args: PactValue[];
}

export interface CapabilityGuard {
  cgName: string;
  cgArgs: PactValue[];
  cgPactId?: string;
}

export interface ModuleGuard {
  moduleName: ModuleName;
  name: string;
}

export interface PactGuard {
  pactId: string;
  name: string;
}

export type Guard =
  | KeysetGuard
  | KeysetRefGuard
  | UserGuard
  | CapabilityGuard
  | ModuleGuard
  | PactGuard;

export interface IWalletAccount {
  address: string;
  publicKey: string;
  guard: Guard;
  keyset: Guard;
  alias: string;
  contract: string;
  chains: Array<{ chainId: ChainId; balance: string }>;
  overallBalance: string;
  walletName: keyof typeof WALLETTYPES;
  walletType?: 'default' | 'WebAuthn';
}

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
