// @ts-ignore
import importedMenu from './../data/menu.json';
export const getData = () => {
    const regex = /__tests/;
    const items = importedMenu;
    if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
        return items.filter((item) => regex.test(item.root))[0]
            .children;
    }
    return items.filter((item) => {
        return !regex.test(item.root);
    });
};
