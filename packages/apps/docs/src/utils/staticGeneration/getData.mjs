import { menuData } from './../../_generated/menu.mjs';

export const getData = () => {
  const data = JSON.parse(JSON.stringify(menuData));
  const regex = /__tests/;
  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return menuData ?? [];
  }
  return (
    data.filter((item) => {
      return !regex.test(item.root);
    }) ?? []
  );
};
