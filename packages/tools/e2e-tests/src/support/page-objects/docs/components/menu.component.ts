import { extractMetadataFromMarkdown } from '@helpers/docs/markdown.helper';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import dirTree from 'directory-tree';
import path from 'path';

export default class MenuComponent {
  private readonly _page: Page;
  private _levelTwo: Locator;
  private _levelOne: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._levelOne = this._page.locator(
      '[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button',
    );
    this._levelTwo = this._page.locator(
      '[data-cy="sidemenu-submenu"] [data-testid="menuItem-2"] > button',
    );
  }

  public async openCollapsedItems(): Promise<void> {
    const collapsedFirstLevelElements = await this._levelOne.all();

    for (const collapsedElement of collapsedFirstLevelElements) {
      await collapsedElement.click();
      await this._page.waitForTimeout(1000);
      await expect(collapsedElement).toHaveAttribute('data-active', 'true');
    }
    const collapsedSecondLevelElements = await this._levelTwo.all();
    for (const collapsedElement of collapsedSecondLevelElements) {
      await collapsedElement.click();
      await expect(collapsedElement).toHaveAttribute('data-active', 'true');
    }
  }

  /**
   This function reads the provided directory (based on a page) and validates if all markdown files are present in the menu.
   @param {string} pageToCheck page to check, e.g. 'Kadena'
   */
  public async validateTree(pageToCheck: string): Promise<void> {
    const baseDir = path.join(
      __dirname,
      '..', // components
      '..', // docs
      '..', // page-objects
      '..', // support
      '..', // e2e-tests
      '..', // tools
      '..', // packages
      'apps',
      'docs',
      'src',
      'pages',
    );
    console.log('baseDir======');
    console.log(baseDir);
    const directory = path.join(baseDir, pageToCheck);
    const exclusioDir = path.join(baseDir, 'pact', 'api');
    const exclusionRegExp = new RegExp(exclusioDir);
    const expectedTree = await dirTree(directory, {
      extensions: /\.md/,
      exclude: [/index.md/, exclusionRegExp],
    });

    const parents = expectedTree?.children;

    for (const parent of parents!) {
      const parentMetaData = await extractMetadataFromMarkdown(parent.path);
      // Validate Menu Items without Children
      if (parent.children?.length === 0) {
        await this._validateSingleMenuItem(parentMetaData.label);
      } else {
        await this._toggleParent(parentMetaData.menu); // Open Parent before validating children
        for (const child of parent.children!) {
          const childMetaData = await extractMetadataFromMarkdown(child.path);
          if (child.children?.length === 0) {
            await this._validateMenuItemWithChildren(
              parentMetaData.menu,
              childMetaData.label,
            );
          } else {
            await this._toggleChild(parentMetaData.menu, childMetaData.menu);
            // validate presence of first level children, this implicitly validates presence of top level menu items with children as well as the children.
            for (const grandChild of child.children!) {
              const grandChildMetaData = await extractMetadataFromMarkdown(
                grandChild.path,
              );
              await this._validateMenuItemWithGrandchildren(
                parentMetaData.menu,
                childMetaData.menu,
                grandChildMetaData.label,
              );
            }
          }
        }
        await this._toggleParent(parentMetaData.menu);
      }
      // Open Parent before validating children
    }
  }
  private async _toggleParent(label: string): Promise<void> {
    await this._page
      .getByTestId(`l1-item`)
      .locator(`[data-testid="l1-button"]:text-is("${label}")`)
      .click();
  }

  private async _toggleChild(
    parentLabel: string,
    childLabel: string,
  ): Promise<void> {
    await this._page
      .getByTestId(`l1-item`)
      .locator(
        `[data-testid="l1-button"]:text-is(${JSON.stringify(
          parentLabel,
        )}) + ul [data-testid="l2-item"] [data-testid="l2-button"]:text-is(${JSON.stringify(
          childLabel,
        )})`,
      )
      .click();
  }

  private async _validateSingleMenuItem(label: string): Promise<void> {
    await expect(
      this._page
        .getByTestId(`l1-item`)
        .locator(`[data-testid="l1-link"]:text-is(${JSON.stringify(label)})`),
      `Expected ${label} to be visible on level 1 in the menu.`,
    ).toBeVisible();
  }

  private async _validateMenuItemWithChildren(
    parentLabel: string,
    childLabel: string,
  ): Promise<void> {
    await expect(
      this._page
        .getByTestId(`l1-item`)
        .locator(
          `[data-testid="l1-button"]:text-is(${JSON.stringify(
            parentLabel,
          )}) + ul [data-testid="l2-item"] [data-testid="l2-link"]:text-is(${JSON.stringify(
            childLabel,
          )})`,
        )
        .first(),
      `Expected ${childLabel} to be visible on level 2 in the menu.`,
    ).toBeVisible();
  }

  private async _validateMenuItemWithGrandchildren(
    parentLabel: string,
    childLabel: string,
    grandChildLabel: string,
  ): Promise<void> {
    await expect(
      this._page
        .getByTestId(`l1-item`)
        .locator(
          `[data-testid="l1-button"]:text-is(${JSON.stringify(
            parentLabel,
          )}) + ul [data-testid="l2-item"] [data-testid="l2-button"]:text-is(${JSON.stringify(
            childLabel,
          )}) + ul [data-testid="l3-item"] [data-testid="l3-link"]:text-is(${JSON.stringify(
            grandChildLabel,
          )})`,
        ),
      `Expected ${grandChildLabel} to be visible on level 3 in the menu.`,
    ).toBeVisible();
  }
}
