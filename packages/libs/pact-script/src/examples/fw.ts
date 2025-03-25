import z from 'zod';

let globalContext: PactContext | null = null;

export const enforceGuard = (guard: guard) => {
  enforce(globalContext !== null, 'NO_CONTEXT', 'No context found');
  const keyset = globalContext?.getByPrincipal(guard.principal)!;
  return enforce(
    keyset.principal === guard.principal && keyset.signed === true,
    'GUARD_VERIFICATION_FAILED',
    `Guard verification failed for "${guard.principal}"`,
  );
};

export type decimal = number;
export type guard = IKeyset;
export class DataMap<
  T extends z.ZodRawShape,
  O extends z.ZodType<any, any, any> = ReturnType<typeof z.object<T>>,
> {
  private tempData: Map<string, z.infer<O>>;
  private data: Map<string, z.infer<O>>;

  private schema: O;
  constructor(rawSchema: T) {
    this.tempData = new Map();
    this.data = new Map();
    this.schema = z.object<T>(rawSchema) as unknown as O;
  }
  get(key: string): z.infer<O> {
    enforce(key !== '', 'INVALID_KEY', 'Key cannot be empty');
    const value = this.tempData.get(key);
    enforce(value !== undefined, 'KEY_NOT_FOUND', `Key ${key} not found`);
    return value!;
  }
  has(key: string) {
    return this.tempData.has(key);
  }
  add(key: string, value: z.infer<O>) {
    enforce(key !== '', 'INVALID_KEY', 'Key cannot be empty');
    const result = this.schema.safeParse(value);
    if (!result.success) {
      enforce(result.success, 'INVALID_VALUE', result.error.message);
    }

    enforce(!this.tempData.has(key), 'KEY_EXISTS', `Key ${key} already exists`);
    this.tempData.set(key, value);
    return 'KEY VALUE PAIR ADDED';
  }
  edit(key: string, value: Partial<z.infer<O>>) {
    enforce(key !== '', 'INVALID_KEY', 'Key cannot be empty');
    const oldValue = this.get(key);
    const updated = { ...oldValue, ...value };
    const result = this.schema.safeParse(updated);
    if (!result.success) {
      enforce(result.success, 'INVALID_VALUE', result.error.message);
    }
    this.tempData.set(key, { ...oldValue, ...value });
    return 'VALUE EDITED';
  }
  commit() {
    this.data = new Map(this.tempData.entries());
  }
  rollback() {
    this.tempData = new Map(this.data.entries());
  }
}

export class PactContract {
  protected capability = capabilityFactory();
  constructor(protected context: PactContext) {
    globalContext = context;
  }
}

export class NonUpgradableContract extends PactContract {
  GOVERNANCE() {
    throw new Error('NON-UPGRADEABILITY: This contract is not upgradable');
  }
}

interface CapabilityFns {
  grant<T>(scoped: () => T): T;
  require(): void;
  compose(): void;
  isInstalled(ksName): boolean;
}

let sharedState = {
  composed: undefined as string[] | undefined,
};

let activeCap: {
  name: string;
  args: any[];
  parameters: string[];
} | null = null;

function getParameterNames<T extends (...args) => any>(func: T) {
  const code = func.toString();
  const match = code.match(/^[^(]*\(([^)]*)\)/);

  if (!match) return [];

  // Split by commas, trim whitespace, and filter out any empty strings
  return match[1]
    .split(',')
    .map((param) => param.trim())
    .filter((param) => param);
}

export function capabilityFactory() {
  const calls = new Map<string, { isGranted }>();
  return function capability<T extends (...args: any) => void>(
    name: string,
    capabilityBody: T,
  ) {
    return (...args: Parameters<T>): CapabilityFns => {
      const key = `${name}:${JSON.stringify(args)}`;
      const parameters = getParameterNames(capabilityBody);
      if (!calls.has(key)) {
        calls.set(key, {
          isGranted: false,
        });
      }
      return {
        grant(scoped) {
          const data = calls.get(key);
          if (!data) {
            throw new Error('Data not found');
          }
          enforce(
            !data.isGranted,
            'ALREADY_GRANTED',
            `Capability already granted: ${key}`,
          );
          const composed = [key];
          sharedState.composed = composed;
          const resetCaps = () => {
            activeCap = null;
            composed.forEach((key) => {
              const data = calls.get(key);
              if (data) {
                data.isGranted = false;
              }
            });
            if (sharedState.composed === composed) {
              sharedState.composed = [];
            }
          };
          try {
            activeCap = {
              name,
              args,
              parameters,
            };
            capabilityBody(...args);
            activeCap = null;
            composed.forEach((key) => {
              const data = calls.get(key);
              if (data) {
                data.isGranted = true;
              }
            });
            const res = scoped();
            resetCaps();
            return res;
          } catch (e) {
            resetCaps();
            throw e;
          }
        },
        require() {
          const data = calls.get(key);
          enforce(
            data && data.isGranted,
            'CAPABILITY_NOT_GRANTED',
            `Capability not granted: ${key}`,
          );
        },
        compose() {
          enforce(
            Array.isArray(sharedState.composed),
            'INVALID_COMPOSE',
            'compose must be called within a capability block',
          );
          capabilityBody(...args);
          sharedState.composed!.push(key);
        },
        isInstalled(ksName: string) {
          enforce(globalContext !== null, 'NO_CONTEXT', 'No context found');
          const ks = globalContext!.getKeyset(ksName);
          enforce(
            ks !== undefined,
            'KEYSET_NOT_FOUND',
            `Keyset not found: ${ksName}`,
          );
          enforce(
            ks.signed === true,
            'KEYSET_NOT_SIGNED',
            `Keyset not signed: ${ksName}`,
          );
          enforce(
            ks.installedCaps !== undefined &&
              ks.installedCaps?.findIndex(
                (cap) => key === `${cap.cap}:${JSON.stringify(cap.args)}`,
              ) !== -1,
            'CAPABILITY_NOT_INSTALLED',
            `Capability not installed: ${key}`,
          );
          return true;
        },
      };
    };
  };
}

export function enforce(
  condition: boolean,
  code: string = 'FAILED',
  message: string = 'Enforcement failed',
) {
  if (!condition) {
    throw new Error(`${code}: ${message}`);
  }
}

export interface IKeyset {
  keys: string[];
  pred: 'keys-all' | 'keys-any' | 'keys-2';
  principal: string;
  signed?: boolean;
  installedCaps?: { cap: string; args: any[]; mangedValue?: any }[];
}

export interface IPactContext {
  data: Record<
    string,
    { keys: string[]; pred: 'keys-all' | 'keys-any' | 'keys-2' }
  >;
}

function withPrincipal(keyset: IPactContext['data'][string]): IKeyset {
  return {
    ...keyset,
    principal: `k:${keyset.keys.sort().join(':')}:${keyset.pred}`,
  };
}

const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export class PactContext {
  private tempKeysets: Map<string, IKeyset> = new Map();
  private keyset: Map<string, IKeyset> = new Map();

  constructor(env: IPactContext) {
    if (env) {
      Object.entries(env.data).forEach(([key, value]) => {
        this.tempKeysets.set(key, withPrincipal(value));
      });
    }
  }

  commit() {
    this.keyset = new Map(
      [...this.tempKeysets.entries()].map(([k, v]) => [
        k,
        {
          ...v,
          installedCaps: Array.isArray(v.installedCaps)
            ? v.installedCaps.map((cap) => ({ ...cap }))
            : undefined,
        },
      ]),
    );
  }
  rollback() {
    this.tempKeysets = new Map(
      [...this.keyset.entries()].map(([k, v]) => [
        k,
        {
          ...v,
          installedCaps: Array.isArray(v.installedCaps)
            ? v.installedCaps.map((cap) => ({ ...cap }))
            : undefined,
        },
      ]),
    );
  }

  getKeyset(name: string) {
    if (!this.tempKeysets.has(name)) {
      throw new Error(`Keyset not found: ${name}`);
    }
    return this.tempKeysets.get(name)!;
  }

  sign(key: string, installedCaps?: { cap: string; args: any[] }[]) {
    const keyset = this.getKeyset(key);
    keyset.signed = true;
    if (installedCaps) {
      keyset.installedCaps = installedCaps;
    }
    return this;
  }

  getByPrincipal(principal: string) {
    for (const keyset of this.tempKeysets.values()) {
      if (keyset.principal === principal) {
        return keyset;
      }
    }
    throw new Error(`Keyset not found: ${principal}`);
  }

  getInstalledValue(cap: string, args: any[], managedIndex: number) {
    const caps = [...this.tempKeysets.values()]
      .flatMap((keyset) => keyset.installedCaps || [])
      .filter(
        (installedCap) =>
          installedCap.cap === cap &&
          installedCap.args.every(
            (arg, i) => i === managedIndex || isEqual(arg, args[i]),
          ),
      );

    const capability = caps[0];
    if (!capability) {
      return undefined;
    }
    if (capability.mangedValue === undefined) {
      capability.mangedValue = capability.args[managedIndex];
    }
    return capability;
  }
}

export function manage<T>(
  property: string,
  fn: (managed: T, requested: T) => T,
) {
  enforce(globalContext !== null, 'NO_CONTEXT', 'No context found');
  enforce(
    activeCap !== null,
    'MANAGE_CALLED_OUTSIDE_CAPABILITY',
    'manage called outside capability',
  );
  const installedPropertyIndex = activeCap!.parameters.indexOf(property);
  enforce(
    installedPropertyIndex !== -1,
    'MANAGE_PROPERTY_NOT_FOUND',
    `Property not found: ${property}`,
  );
  const installedCap = globalContext!.getInstalledValue(
    activeCap!.name,
    activeCap!.args,
    installedPropertyIndex,
  );
  enforce(
    installedCap !== undefined,
    'CAPABILITY_NOT_INSTALLED',
    `cant find installed value for : ${property}`,
  );

  // TODO: we need a way to rollback the changes if the fn throws
  installedCap!.mangedValue = fn(
    installedCap!.mangedValue,
    activeCap!.args[installedPropertyIndex],
  );
}

export function createPactContract<T extends PactContract>(contract: T) {
  const commit = (obj) => {
    Object.values(obj).forEach((value) => {
      if (value instanceof DataMap) {
        value.commit();
      }
    });
  };
  const rollback = (obj) => {
    Object.values(obj).forEach((value) => {
      if (value instanceof DataMap) {
        value.rollback();
      }
    });
  };

  return new Proxy(contract, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== 'function') return value;

      return (...args) => {
        try {
          commit(contract);
          globalContext?.commit();
          const result = value.apply(target, args);
          commit(contract);
          globalContext?.commit();
          return result;
        } catch (e) {
          rollback(contract);
          globalContext?.rollback();
          throw e;
        }
      };
    },
  });
}
