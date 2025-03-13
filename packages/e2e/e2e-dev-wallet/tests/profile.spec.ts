import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test.beforeEach(async ({ initiator }) => {
  await initiator.goto('/');
  await initiator.evaluate(() => {
    window.localStorage.setItem('isInDevelopmentMessageShown', 'true');
  });
});

test('Login passwordless', async ({ initiator, chainweaverApp }) => {
  await test.step('create profile', async () => {
    await initiator.goto('/');
    const profileName = await chainweaverApp.createProfile(initiator);
    expect(profileName).toBeTruthy();

    await expect(
      initiator.getByRole('heading', {
        name: 'Your Assets',
      }),
    ).toBeVisible();

    const loggedOut = await chainweaverApp.logout(initiator, profileName);
    expect(loggedOut).toEqual(true);
  });

  await test.step('Select Profile', async () => {
    await initiator.goto('/');

    const loggedIn = await chainweaverApp.selectProfile(initiator, 'He-man');
    expect(loggedIn).toEqual(true);
  });
});

test('Login with password', async ({ initiator, chainweaverApp }) => {
  await test.step('create profile with a password', async () => {
    await initiator.goto('/');
    const { profileName } =
      await chainweaverApp.createProfileWithPassword(initiator);
    expect(profileName).toBeTruthy();

    await expect(
      initiator.getByRole('heading', {
        name: 'Your Assets',
      }),
    ).toBeVisible();

    const loggedOut = await chainweaverApp.logout(initiator, profileName);
    expect(loggedOut).toEqual(true);
  });
});
