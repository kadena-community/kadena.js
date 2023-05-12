import importedMenu from './../../data/menu.json' assert { type: 'json' };

export const getData = () => {
  const regex = /__tests/;
  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return importedMenu.filter((item) => regex.test(item.root))[0].children;
  }
  return importedMenu.filter((item) => {
    return !regex.test(item.root);
  });
};
