import type { ICapability, IModule } from '../pactParser';

export const getCapabilityDetails = (
  module: IModule,
  capability: string,
): ICapability | undefined =>
  module.capabilities?.find((cap) => cap.name === capability);

const asArray = <T>(value: T[] | undefined): T[] => (value ? value : []);

// returns all possible capabilities that can be used in a function, including composed capabilities
export const getCapabilities = (
  modules: Map<string, IModule>,
  fullModuleName: string,
  functionName: string,
): Array<{
  name: string;
  fullModuleName: string;
  reason: 'with-capability' | 'compose-capability';
  origin: string;
  capability: ICapability;
}> => {
  const mod = modules.get(fullModuleName);
  if (!mod) return [];

  const func = mod.functions?.find((f) => f.name === functionName);
  if (!func) return [];

  const withCapabilities = asArray(func.withCapabilities).map((name) => ({
    name,
    fullModuleName,
    reason: 'with-capability' as const,
    origin: func.name,
    capability: getCapabilityDetails(mod, name) as ICapability,
  }));

  const composeCapabilities = withCapabilities.flatMap((item) => {
    const cap = getCapabilityDetails(mod, item.name);
    if (!cap || !cap.composeCapabilities) return [];
    return cap.composeCapabilities.map((name) => ({
      name,
      fullModuleName,
      reason: 'compose-capability' as const,
      origin: cap.name,
      capability: getCapabilityDetails(mod, name) as ICapability,
    }));
  });

  const directCaps = [...withCapabilities, ...composeCapabilities]
    // remove duplicates. we might need to revisit this by considering all possible cases
    .filter(
      (capability, idx, list) =>
        idx === list.findIndex((cap) => cap.name === capability.name),
    );

  if (!func.functionCalls) return directCaps;

  const { internal, external } = func.functionCalls;

  const internalCalls = internal.map((funcName) => ({
    modName: fullModuleName,
    funcName,
  }));

  const externalCalls = external.map(
    ({ namespace, module: moduleName, func }) => ({
      modName:
        namespace !== undefined && namespace.length
          ? `${namespace}.${moduleName}`
          : moduleName,
      funcName: func,
    }),
  );
  const indirectCaps = [...internalCalls, ...externalCalls].flatMap(
    ({ modName, funcName }) => getCapabilities(modules, modName, funcName),
  );
  return [...directCaps, ...indirectCaps];
};
