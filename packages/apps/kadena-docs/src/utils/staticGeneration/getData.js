import { menuData } from './../../data/menu.js';

export const getData = () => {
  const regex = /__tests/;
  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return menuData.filter((item) => regex.test(item.root))[0].children ?? [];
  }
  return (
    menuData.filter((item) => {
      return !regex.test(item.root);
    }) ?? []
  );
};
