import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import dirTree from 'directory-tree';
import { extractMetadataFromMarkdown } from './markdown.helper';

export default class TreeHelper {
  private readonly _page: Page;

  public constructor(page: Page) {
    this._page = page;
  }

  /**
   This function reads the provided directory (based on a page) and validates if all markdown files are present in the menu.
   @param {string} pageToCheck page to check, e.g. 'Kadena'
   */
  public async validateTree(pageToCheck: string): Promise<void> {
    const directory = `../../apps/docs/src/pages/${pageToCheck}`;
    const expectedTree = await dirTree(directory, {
      extensions: /\.md/,
      exclude: [/index.md/, /api/],
    });
    const menuItems = expectedTree?.children;

    if (expectedTree?.children) {
      for (const menuItem of menuItems!) {
        // Validate top level menu items, without children
        if (!menuItem.children) {
          const metaData = await extractMetadataFromMarkdown(menuItem.path);
          await this.validateParent(metaData[0].label);
        } else {
          // validate presence of first level children, this implicitly validates presence of top level menu items with children as well as the children.
          for (const child of menuItem.children) {
            if (!child.children) {
              const metaData = await extractMetadataFromMarkdown(
                `${menuItem.path}/index.md`,
                child.path,
              );
              await this.validateChild(metaData[0].menu, metaData[1].label);
            } else {
              // validate presence of first level children, this implicitly validates presence of top level menu items with children as well as the children.
              for (const grandChild of child.children) {
                const metaData = await extractMetadataFromMarkdown(
                  `${menuItem.path}/index.md`,
                  `${child.path}/index.md`,
                  `${grandChild.path}/index.md`,
                );
                await this.validateGrandChild(
                  metaData[0].menu,
                  metaData[1].menu,
                  metaData[2].label,
                );
              }
            }
          }
        }
      }
    }
  }

  /**
   This function validates presence of parent items in the menu.
   @param {string} label of the menu item to validate
   */
  public async validateParent(label: string): Promise<void> {
    await expect(
      this._page.locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > a:text-is("${label}")`,
      ),
      `Expected ${label} to be visible on level 1 in the menu.`,
    ).toBeVisible();
  }

  /**
   This function validates presence of a child item in the menu.
   @param {string} parentLabel of the parent menu item
   @param {string} childLabel of the menu item to validate
   */
  public async validateChild(
    parentMenu: string,
    childLabel: string,
  ): Promise<void> {
    // open parent menu first
    await this._page
      .locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}")`,
      )
      .click();
    await expect(
      this._page.locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}") + ul [data-testid="menuItem-2"] > a:text-is("${childLabel}")`,
      ),
      `Expected ${childLabel} to be visible on level 2 in the menu.`,
    ).toBeVisible();
    // then close parent menu again
    await this._page
      .locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}")`,
      )
      .click();
  }

  /**
   This function validates presence of a grandchild item in the menu.
   @param {string} parentMenu of the parent menu item
   @param {string} childMenu of the child menu item
   @param {string} grandChildLabel of the menu item to validate
   */
  public async validateGrandChild(
    parentMenu: string,
    childMenu: string,
    grandChildLabel: string,
  ): Promise<void> {
    // open parent and child menu first
    await this._page
      .locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}")`,
      )
      .click();
    await this._page
      .locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}") + ul [data-testid="menuItem-2"] > button:text-is("${childMenu}")`,
      )
      .click();
    await expect(
      this._page.locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}") + ul [data-testid="menuItem-2"] > button:text-is("${childMenu}") + ul [data-testid="menuItem-3"] > a:text-is("${grandChildLabel}")`,
      ),
      `Expected ${grandChildLabel} to be visible on level 3 in the menu.`,
    ).toBeVisible();
    // Close parent and child menu
    await this._page
      .locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}")`,
      )
      .click();
    await this._page
      .locator(
        `[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button:text-is("${parentMenu}") + ul [data-testid="menuItem-2"] > button:text-is("${childMenu}")`,
      )
      .click();
  }
}
