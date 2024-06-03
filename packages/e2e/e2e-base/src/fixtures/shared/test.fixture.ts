import { mergeTests } from '@playwright/test';
import { test as pageObjectsFixture } from './page-obects.fixture';
import { test as personaFixture } from './persona.fixture';

export const test = mergeTests(pageObjectsFixture, personaFixture);
