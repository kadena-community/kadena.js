import { test } from '@playwright/test';
import MenuHelper from './helpers/menu.helper';
import TreeHelper from './helpers/tree.helper';
import CookieHelper from './helpers/cookie.helper';


const pages = ['kadena', 'build', 'pact', 'chainweb', 'marmalade', 'contribute'];

for (const pageToCheck of pages) {
test(`Page: ${pageToCheck} - All Markdown files should be present in the menu`, async ({ page }) => {
    const menuHelper = new MenuHelper(page)
    const treeHelper = new TreeHelper(page)
    const cookieHelper = new CookieHelper(page)

    await page.goto(pageToCheck);
    await cookieHelper.acceptCookies();
    await treeHelper.validateTree(pageToCheck)
});
}
