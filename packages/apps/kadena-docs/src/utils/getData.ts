// @ts-ignore
import importedMenu from './../data/menu.json';

import { IMenuItem } from '@/types/Layout';

export const getData = (): IMenuItem[] => {
  const regex = /__tests/;
  const items: IMenuItem[] = importedMenu as IMenuItem[];
  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return items.filter((item) => regex.test(item.root))[0]
      .children as IMenuItem[];
  }
  return items.filter((item) => {
    return !regex.test(item.root);
  }) as IMenuItem[];
};
