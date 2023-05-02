import importedMenu from '../../../../data/menu.json';

import { IMenuItem } from '@/types/Layout';

export const getData = (): IMenuItem[] => {
  const regex = /__tests/;

  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return importedMenu.filter((item) => regex.test(item.root))[0]
      .children as IMenuItem[];
  }
  return importedMenu.filter((item) => {
    return !regex.test(item.root);
  }) as IMenuItem[];
};
