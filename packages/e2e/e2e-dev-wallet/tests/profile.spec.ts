import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Login', async ({ initiator, chainweaverApp }) => {
  await test.step('create profile', async () => {
    await initiator.goto('/');
    const loggedIn = await chainweaverApp.createProfile(initiator);
    expect(loggedIn).toEqual(true);

    await expect(
      initiator.getByRole('heading', {
        name: 'Your Assets',
      }),
    ).toBeVisible();

    const loggedOut = await chainweaverApp.logout(initiator);
    expect(loggedOut).toEqual(true);
  });

  await test.step('Select Profile', async () => {
    await initiator.goto('/');

    const loggedIn = await chainweaverApp.selectProfile(initiator, 'He-man');
    expect(loggedIn).toEqual(true);
  });
});
