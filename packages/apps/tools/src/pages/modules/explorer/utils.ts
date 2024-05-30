import type { TreeItem } from '@/components/Global/CustomTree/CustomTree';
import type { Outline } from '@/components/Global/ModuleExplorer/types';
import type { ModuleModel } from '@/hooks/use-module-query';
import type { Optional } from '@/types/utils';
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

export type IncompleteModuleModel = Optional<ModuleModel, 'code'>;

const mapToTreeItems = (
  modulesMap: Map<Namespace, ModuleData | Map<ModuleName, ModuleData>>,
  parent?: Namespace,
): TreeItem<IncompleteModuleModel>[] => {
  return [...modulesMap]
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([name, value]) => {
      let children;

      if (value instanceof Map) {
        const mapped = mapToTreeItems(
          value,
          `${typeof parent === 'string' ? `${parent}.` : ''}${name}`,
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
          };
        });
      }

      const aux: IncompleteModuleModel = {
        name,
        chainId: '0',
        networkId: 'mainnet01',
      };

      return {
        data: aux,
        key: `${typeof parent === 'string' ? `${parent}.` : ''}${name}`,
        title: name,
        children,
      };
    });
};

export const isModule = (
  item: IncompleteModuleModel | Outline,
): item is IncompleteModuleModel => {
  return (
    typeof item !== 'string' &&
    (item as IncompleteModuleModel).chainId !== undefined &&
    (item as IncompleteModuleModel).name !== undefined &&
    (item as IncompleteModuleModel).networkId !== undefined
  );
};

export const modelsToTreeItems = (
  models: Array<IncompleteModuleModel>,
  key: string,
): TreeItem<IncompleteModuleModel>[] => {
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

  const treeItems: TreeItem<IncompleteModuleModel>[] = mapToTreeItems(
    modulesMap,
    key,
  );

  return treeItems;
};
