import { menuData } from './../../data/menu.js';

export const getData = () => {
  const data = JSON.parse(JSON.stringify(menuData));
  const regex = /__tests/;
  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return data.filter((item) => regex.test(item.root))[0].children ?? [];
  }
  return (
    data.filter((item) => {
      return !regex.test(item.root);
    }) ?? []
  );
};
