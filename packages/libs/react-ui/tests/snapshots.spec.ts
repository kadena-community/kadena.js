import { expect, test } from '@playwright/test';
// we can't create tests asynchronously, thus using the sync-fetch lib
import fetch from 'sync-fetch';

// URL where Ladle is served
const url = 'http://localhost:61000';

// fetch Ladle's meta file
// https://ladle.dev/docs/meta
const stories = fetch(`${url}/meta.json`).json().stories;

// iterate through stories
Object.keys(stories).forEach((storyKey) => {
  // create a test for each story
  test(`${storyKey} - compare snapshots`, async ({ page }) => {
    // skip stories with `meta.skip` set to true
    test.skip(stories[storyKey].meta.skip, 'meta.skip is true');
    // navigate to the story
    await page.goto(`${url}/?story=${storyKey}&mode=preview`);
    // stories are code-splitted, wait for them to be loaded
    await page.waitForSelector('[data-storyloaded]');
    // take a screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot(`${storyKey}.png`);
  });
});
