import type { IMenuData } from '../../types';
import { getData } from './getData';

export const flatPosts = (acc: IMenuData[], val: IMenuData): IMenuData[] => {
  const { children, ...newVal } = val;

  if (!children || !children.length) {
    return [...acc, newVal as IMenuData];
  }
  return [
    ...acc,
    newVal as IMenuData,
    ...children.reduce(flatPosts, []).flat(),
  ];
};

export const getFlatData = async (): Promise<IMenuData[]> => {
  const data = await getData();
  return data.reduce(flatPosts, []).flat();
};

export const flattenData = (data: IMenuData[]): IMenuData[] => {
  return data.reduce(flatPosts, []).flat();
};
