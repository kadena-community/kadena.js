import { test } from '@fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test(`MultiContext in 1 test`, async ({ personA, personB, page }) => {
  await test.step('A: Open the devworld page', async () => {
    await personA.page.goto('devworld.kadena.io');
  });
  await test.step('B: Open the devworld page', async () => {
    await personB.page.goto('spyrekey.kadena.io');
    expect(true).toBeTruthy();
  });
});
