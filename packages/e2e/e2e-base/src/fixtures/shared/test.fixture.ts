import { mergeTests } from '@playwright/test';
import { test as pageObjectsFixture } from './page-obects.fixture';

export const test = mergeTests(pageObjectsFixture);
