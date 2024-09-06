// packages/apps/graph/src/graph/types/guard.ts

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

export type PactValue = PvLiteral | PvList | PvGuard | PvObject | PvModRef | PvTime | PvCapToken;

export type PvList = PactValue[];

export type PvGuard = Guard;

export type PvObject = Record<string, PactValue>;

export type Keyset = {
  keys: string[];
  pred: string;
};

export type KeysetRef = {
  keysetref: {
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

export type Guard = Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard;
