import z from 'zod';

let globalContext: PactContext | null = null;

export const enforceGuard = (guard: guard) => {
  enforce(globalContext !== null, 'NO_CONTEXT', 'No context found');
  const keyset = globalContext.getByPrincipal(guard.principal);
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
    return value;
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
    return true;
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
    return true;
  }
  commit() {
    this.data = new Map(this.tempData.entries());
  }
  rollback() {
    this.tempData = new Map(this.data.entries());
  }
}

export abstract class PactContract {
  public static readonly moduleName;

  constructor(protected context: PactContext) {
    globalContext = context;
  }

  public static create<T extends PactContract>(
    this: new (context: PactContext) => T,
    context: PactContext,
  ): T {
    if (!(this as any).moduleName) {
      console.warn(
        `Module name is not set for ${this.name}; using class name instead. Set the static property "moduleName" to the desired module name.`,
      );
    }
    const instance = new this(context);
    return pactRunner(instance);
  }

  private calls = new Map<string, { isGranted: boolean }>();

  protected capability<T extends (...args: any) => void>(
    name: string,
    capabilityBody: T,
  ) {
    const calls = this.calls;
    const moduleName =
      (this.constructor as any).moduleName || this.constructor.name;

    return (...args: Parameters<T>): CapabilityFns => {
      const key = `${moduleName}.${name}:${JSON.stringify(args)}`;
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
              moduleName,
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
            data !== undefined && data.isGranted,
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
          sharedState.composed.push(key);
        },
      };
    };
  }

  protected manage<T>(property: string, fn: (managed: T, requested: T) => T) {
    enforce(this.context !== null, 'NO_CONTEXT', 'No context found');
    enforce(
      activeCap !== null,
      'MANAGE_CALLED_OUTSIDE_CAPABILITY',
      'manage called outside capability',
    );
    const installedPropertyIndex = activeCap.parameters.indexOf(property);
    enforce(
      installedPropertyIndex !== -1,
      'MANAGE_PROPERTY_NOT_FOUND',
      `Property not found: ${property}`,
    );
    const installedCap = this.context.getInstalledValue(
      `${activeCap.moduleName}.${activeCap.name}`,
      activeCap.args,
      installedPropertyIndex,
    );
    enforce(
      installedCap !== undefined,
      'CAPABILITY_NOT_INSTALLED',
      `the : ${property} in not installed for ${activeCap!.moduleName}.${
        activeCap!.name
      }`,
    );

    installedCap.mangedValue = fn(
      installedCap.mangedValue,
      activeCap.args[installedPropertyIndex],
    );
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
}

let sharedState = {
  composed: undefined as string[] | undefined,
};

let activeCap: {
  namespace?: string;
  moduleName: string;
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

export function enforce(
  condition: boolean,
  code: string = 'FAILED',
  message: string = 'Enforcement failed',
): asserts condition {
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
    {
      keys: string[];
      pred: 'keys-all' | 'keys-any' | 'keys-2';
      signed?: boolean;
      installedCaps?: { cap: string; args: any[]; mangedValue?: any }[];
    }
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
      const clone: IPactContext = structuredClone(env);
      Object.entries(clone.data).forEach(([key, value]) => {
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

export function pactRunner<T extends PactContract>(contract: T) {
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
          globalContext =
            'context' in contract ? (contract as any).context : null;
          commit(contract);
          globalContext?.commit();
          const result = value.apply(target, args);
          commit(contract);
          globalContext?.commit();
          globalContext = null;
          return result;
        } catch (e) {
          rollback(contract);
          globalContext?.rollback();
          globalContext = null;
          throw e;
        }
      };
    },
  });
}

export function capability(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return this.capability(propertyKey, (...innerArgs: any[]) => {
      return originalMethod.apply(this, innerArgs);
    })(...args);
  };
}
