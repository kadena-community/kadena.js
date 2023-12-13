import { IMenuData } from 'src/types';
import { getConfig, getData } from './staticGeneration/getData';

export const getHeaderItems = async (): Promise<IMenuData[]> => {
  const { menu } = await getConfig();
  const tree = await getData();

  const menuItems = menu.reduce(
    (acc: IMenuData[], item: string): IMenuData[] => {
      const found = tree.find((d) => d.root === `/${item}`);
      if (!found) return acc;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, ...result } = found;
      acc.push(result as IMenuData);
      return acc;
    },
    [],
  );

  return menuItems;
};
