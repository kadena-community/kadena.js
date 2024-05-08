import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import path from 'node:path';

export default class TreeHelper {
  private readonly _page: Page;

  private _levelZero: Locator;
  public constructor(page: Page) {
    this._page = page;
    this._levelZero = this._page.getByTestId('l0-item');
  }

  /**
   This function reads the menu.json file and validates the menu structure for a deployed app.
   @param {string} pageToCheck page to check, e.g. 'Kadena'
   */
  public async validateTree(pageToCheck: string): Promise<void> {
    const baseDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'apps',
      'docs',
      'src',
      '_generated',
    );

    const json = JSON.parse(fs.readFileSync(`${baseDir}/menu.json`, 'utf-8'));
    const treeItems = json.find(
      (menuItems: { root: string }) => menuItems.root === `/${pageToCheck}`,
    );
    await this._assertLevelZero(treeItems.menu);
    // Iterate over each level 1 item.
    // console.log('iterate over each level 1 item')
    for (const levelOneItem of treeItems.children!) {
      // console.log('checking L1 without children')
      // For each level 1 item without children, check if it is attached
      if (levelOneItem.children?.length === 0) {
        await this._assertLevelOne(treeItems.menu, levelOneItem.label);
      } else if (levelOneItem.children?.length !== 0) {
        // console.log('checking L1 with children')
        // For each level 1 item with children, check if it is attached and return a locator reference to it
        await this._assertLevelOne(treeItems.menu, levelOneItem.menu, true);
        // For Each level 1 with children, iterate over each level 2 item (child)
        for (const levelTwoItem of levelOneItem.children!) {
          if (levelTwoItem.children?.length === 0) {
            // console.log('checking L2 without children')
            // For each level 2 item without children, check if it is attached
            await this._assertLevelTwo(
              treeItems.menu,
              levelOneItem.menu,
              levelTwoItem.label,
            );
          } else if (levelTwoItem.children?.length !== 0) {
            // console.log('checking L2 with children')
            // For each level 2 item with children, check if it is attached and return a locatorReference to it
            await this._assertLevelTwo(
              treeItems.menu,
              levelOneItem.menu,
              levelTwoItem.menu,
              true,
            );
            for (const levelThreeItem of levelTwoItem.children!) {
              // console.log('checking L3')
              // For each level 3 item, check if it is attached
              await this._assertLevelThree(
                treeItems.menu,
                levelOneItem.menu,
                levelTwoItem.menu,
                levelThreeItem.label,
              );
            }
          }
        }
      }
    }
  }

  private async _assertLevelZero(label: string): Promise<Locator> {
    const locator = this._levelZero.locator(
      `[data-testid="l0-button"]:text-is("${label}")`,
    );
    await expect(locator).toBeAttached();
    return locator;
  }

  private async _assertLevelOne(
    l0label: string,
    l1label: string,
    hasChild: boolean = false,
  ): Promise<void> {
    const parentLocator = this._levelZero
      .locator(`[data-testid="l0-button"]:text-is("${l0label}")`) // Find a l0-button wih a specific text
      .locator('..') // Go up one level (to the parent of the button)
      .getByTestId('l1-item'); // Find the l1-item child of the parent l0-item

    let menuItem: Locator; // This will chain the desired menu item locator to the parentLocator
    switch (hasChild) {
      case true:
        menuItem = parentLocator.getByRole('button', {
          name: `${l1label} +`,
          exact: true,
        });
        break;
      default:
        menuItem = parentLocator.getByRole('link', {
          name: `${l1label}`,
          exact: true,
        });
        break;
    }
    await expect(menuItem).toBeAttached(); // Assert that the menu item is attached
  }

  private async _assertLevelTwo(
    l0label: string,
    l1label: string,
    l2label: string,
    hasChild: boolean = false,
  ): Promise<void> {
    const parentLocator = this._levelZero
      .locator(`[data-testid="l0-button"]:text-is("${l0label}")`) // Find a l0-button wih a specific text
      .locator('..') // Go up one level (to the parent of the button)
      .getByTestId('l1-item') // Find the l1-item child of the parent l0-item
      .locator(`[data-testid="l1-button"]:text-is("${l1label}")`) // Find a l1-button with a specific text
      .locator('..') // Go up one level (to the parent of the button)
      .getByTestId('l2-item'); // Find the l2-item child of the parent l1-item

    let menuItem: Locator; // This will chain the desired menu item locator to the parentLocator
    switch (hasChild) {
      case true:
        menuItem = parentLocator.getByRole('button', {
          name: `${l2label}`,
          exact: true,
        });
        break;
      default:
        menuItem = parentLocator
          .getByRole('link', { name: `∙ ${l2label}`, exact: true })
          .first();
        break;
    }
    await expect(menuItem).toBeAttached();
  }

  private async _assertLevelThree(
    l0label: string,
    l1label: string,
    l2label: string,
    l3label: string,
  ): Promise<void> {
    const menuItem = this._levelZero
      .locator(`[data-testid="l0-button"]:text-is("${l0label}")`) // Find a l0-button wih a specific text
      .locator('..') // Go up one level (to the parent of the button)
      .getByTestId('l1-item') // Find the l1-item child of the parent l0-item
      .locator(`[data-testid="l1-button"]:text-is("${l1label}")`) // Find a l1-button with a specific text
      .locator('..') // Go up one level (to the parent of the button)
      .getByTestId('l2-item') // Find the l2-item child of the parent l1-item
      .locator(`[data-testid="l2-button"]:text-is("${l2label}")`) // Find a l2-button with a specific text
      .locator('..') // Go up one level (to the parent of the button)
      .getByTestId('l3-item') //  Find the l3-item child of the parent l2-item
      .locator(`[data-testid="l3-link"]:text-is("${l3label}")`); // Find a l3-link with a specific text

    await expect(menuItem).toBeAttached();
  }
}
