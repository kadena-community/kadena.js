import i18nEn from '@kadena/tools/locales/en/common.json';
import { test as baseTest } from '@playwright/test';
import { createI18nFixture } from 'playwright-i18next-fixture';

const i18nFixture = createI18nFixture({
  // i18n configuration options
  options: {
    debug: false, //Enable this if you're having issues getting translations to work.
    ns: ['common'],
    lng: 'en',
    cleanCode: true,
    resources: {
      en: {
        common: i18nEn,
      },
    },
  },
  // Fetch translations once and cache them for the rest of the test run
  // Default: true
  cache: true,
  // Run as auto fixture to be available through all tests by getI18nInstance()
  // Default: true
  auto: true,
});

export const test = baseTest.extend(i18nFixture);
