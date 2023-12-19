import { mergeTests } from '@playwright/test';
import { test as i18nFixture } from './i18n.fixture';
import { test as pageObjectsFixture } from './page-obects.fixture';

export const test = mergeTests(pageObjectsFixture, i18nFixture);
