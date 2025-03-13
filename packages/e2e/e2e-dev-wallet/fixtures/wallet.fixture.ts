import { test as baseTest } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';

export const test = baseTest.extend<{ removeDevelopWarning: void }>({
  removeDevelopWarning: [
    async ({ initiator }, use) => {
      await initiator.addInitScript((params) => {
        window.localStorage.setItem('isInDevelopmentMessageShown', 'true');
      });

      await use();
    },
    {
      auto: true,
    },
  ],
});
