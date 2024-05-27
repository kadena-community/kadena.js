import { TreeItem } from '@/components/Global/CustomTree/CustomTree';
import { getName, parse } from '@/utils/persist';
import { CHAINS, ChainwebChainId } from '@kadena/chainweb-node-client';
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
export type ModuleData = Array<{ title: string; hash?: string }>; //string[];

export type ModulesMap = Map<
  Namespace,
  ModuleData | Map<ModuleName, ModuleData>
>;

const mapToTreeItems = (
  modulesMap: Map<Namespace, ModuleData | Map<ModuleName, ModuleData>>,
  parent?: Namespace,
): TreeItem<string>[] => {
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
            data: chain.title,
            key: `${typeof parent === 'string' ? `${parent}.` : ''}${name}.${chain.title}`,
            // title: `some even longer long title ${chain.title}`,
            title: chain.title,
            children: [],
            label: chain.hash ?? 'something',
          };
        });
      }

      return {
        data: name,
        key: `${typeof parent === 'string' ? `${parent}.` : ''}${name}`,
        title: name,
        children,
      };
    });
};

export const xToY = (
  x: Array<{
    name: string;
    chainId: ChainwebChainId;
    code?: string;
    hash?: string;
  }>,
  key: string,
): TreeItem<string>[] => {
  const modulesMap: ModulesMap = new Map();

  x.forEach((module) => {
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

      moduleList.push({ title: module.chainId, hash: module.hash });
    } else {
      if (!modulesMap.has(namespace)) {
        modulesMap.set(namespace, []);
      }

      const moduleList = modulesMap.get(namespace)! as Array<{
        title: string;
        hash?: string;
      }>;

      moduleList.push({ title: module.chainId, hash: module.hash });
    }
  });

  const treeItems: TreeItem<string>[] = mapToTreeItems(modulesMap, key);

  return treeItems;
};
