import { test as baseTest } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';
import { interceptGQL } from '../src/interceptGQL';

export const test = baseTest.extend<{ interceptGQL: typeof interceptGQL }>({
  interceptGQL: async ({ browser }, use) => {
    await use(interceptGQL);
  },
});

test('setup the app', async ({ page, interceptGQL }) => {
  await test.step('login', async () => {
    await interceptGQL(page, 'events', 'IDENTITY-REGISTERED', {
      events: {
        __typename: 'QueryEventsConnection',
        edges: [
          {
            __typename: 'QueryEventsConnectionEdge',
            node: {
              chainId: 0,
              requestKey: 'z-DQhqJHbUK8-EDS4BU7cWCx24oBGCCMIghP33mm1O4',
              parameters:
                '["k:b862e7939e91b4df46947c448a1b48a34ab24798f32f97773b04408be3328d25",{"keys":["b862e7939e91b4df46947c448a1b48a34ab24798f32f97773b04408be3328d25"],"pred":"keys-all"},"k:ba9ab84472ddaa97ae439d3b7e8ffde52b902eed5727fcb91e1f0b9eff0778db"]',
              __typename: 'Event',
              block: {
                height: 7007,
                creationTime: '2025-01-20T09:07:10.280Z',
                __typename: 'Block',
              },
            },
          },
        ],
      },
    });

    await page.route(
      'http://localhost:8080/chainweb/0.0/development/chain/**/*',
      async (route) => {
        const postData = route.request().postDataJSON();
        if (postData.cmd.includes('address-frozen')) {
          await route.fulfill({
            json: {
              result: { status: 'success', data: false },
            },
          });
        }

        if (postData.cmd.includes('get-balance')) {
          await route.fulfill({
            json: {
              result: { status: 'success', data: 500 },
            },
          });
        }

        if (postData.cmd.includes('.supply)')) {
          await route.fulfill({
            json: {
              result: { status: 'success', data: 1234 },
            },
          });
        }
      },
    );

    await page.goto('/investors');

    await expect(page.getByRole('heading', { name: 'test' })).toBeVisible({
      timeout: 120000,
    });
  });
});
