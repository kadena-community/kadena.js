import type { TreeItem } from '@/components/Global/CustomTree/CustomTree';
import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import { getName, parse } from '@/utils/persist';
import type { NextApiRequestCookies } from 'next/dist/server/api-utils';
import type { ParsedUrlQuery } from 'querystring';

export const getQueryValue = (
  needle: string,
  haystack: ParsedUrlQuery,
  validator?: (value: string) => boolean,
): string | undefined => {
  if (typeof haystack[needle] === 'undefined') {
    return undefined;
  }

  const value = Array.isArray(haystack[needle])
    ? (haystack[needle]![0] as string)
    : (haystack[needle] as string);

  if (validator) {
    return validator(value) ? value : undefined;
  }

  return value;
};

// Function signature when defaultValue is provided
export function getCookieValue<Expected>(
  needle: string,
  haystack: NextApiRequestCookies,
  defaultValue: Expected,
): Expected;

// Function signature when defaultValue is not provided
export function getCookieValue<Expected>(
  needle: string,
  haystack: NextApiRequestCookies,
): Expected | null;

// Implementation of the function
export function getCookieValue<Expected>(
  needle: string,
  haystack: NextApiRequestCookies,
  defaultValue?: Expected,
): Expected | null {
  const encoded = encodeURIComponent(getName(needle));
  const value = haystack[encoded];
  if (typeof value !== 'undefined') {
    return parse(value) as Expected;
  }
  return defaultValue ?? null;
}

export type Namespace = string;
export type ModuleName = string;
export type ModuleData = Array<IncompleteModuleModel>;

export type ModulesMap = Map<
  Namespace,
  ModuleData | Map<ModuleName, ModuleData>
>;

/**
 * This function takes a mapped structure of Modules and recursively turns it into a list of TreeItems.
 *
 * @param modulesMap
 * @param parent - Optional extra key (e.g. the namespace) to prefix the key of the tree item
 * @returns List of TreeItems
 */
export const mapToTreeItems = (
  modulesMap: ModulesMap,
  activeModule?: IncompleteModuleModel,
  parent?: Namespace,
  needsSorting = true,
): TreeItem<IncompleteModuleModel>[] => {
  const mappArray = [...modulesMap];
  if (needsSorting) {
    mappArray.sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
  }
  return mappArray.map(([name, value]) => {
    let children;

    if (value instanceof Map) {
      const mapped = mapToTreeItems(
        value,
        activeModule,
        `${typeof parent === 'string' ? `${parent}.` : ''}${name}`,
        needsSorting,
      );
      children = mapped;
    } else {
      children = value.map((chain) => {
        return {
          data: chain,
          key: `${typeof parent === 'string' ? `${parent}.` : ''}${name}.${chain.chainId}`,
          title: chain.chainId,
          children: [],
          label: chain.hash,
          isActive:
            chain.networkId === activeModule?.networkId &&
            chain.name === activeModule?.name &&
            chain.chainId === activeModule?.chainId,
        };
      });
    }

    // Let's take the info from the first child as our data
    const aux: IncompleteModuleModel = {
      name: children[0].data.name,
      chainId: children[0].data.chainId,
      networkId: children[0].data.networkId,
    };

    return {
      data: aux,
      key: `${typeof parent === 'string' ? `${parent}.` : ''}${name}`,
      title: name,
      children,
    };
  });
};

/**
 * This function takes a list of Modules and turn it into a mapped structure. If the module has a
 * namespace ("<namespace>.<module_name>"), it will be nested inside the namespace.
 *
 * E.g. it will a return a structure like this;
 *
 * Map<'arkade', Map<'airdrop', [{}]>>
 * Map<'coin, [{}]>
 *
 * @param models List of Module models.
 * @returns Mapped structure of the modules.
 */
export const modelsToTreeMap = (
  models: Array<IncompleteModuleModel>,
): ModulesMap => {
  const modulesMap: ModulesMap = new Map();

  models.forEach((module) => {
    const [namespace, moduleName] = module.name.split('.');

    if (moduleName) {
      if (!modulesMap.has(namespace)) {
        modulesMap.set(namespace, new Map());
      }

      const map = modulesMap.get(namespace)! as Map<ModuleName, ModuleData>;

      if (!map.has(moduleName)) {
        map.set(moduleName, []);
      }

      const moduleList = map.get(moduleName)!;

      moduleList.push(module);
    } else {
      if (!modulesMap.has(namespace)) {
        modulesMap.set(namespace, []);
      }

      const moduleList = modulesMap.get(
        namespace,
      )! as Array<IncompleteModuleModel>;

      moduleList.push(module);
    }
  });

  return modulesMap;
};
