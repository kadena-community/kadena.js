import { expect, test } from 'vitest';
import {
  attachSignature,
  createCap,
  createCommand,
  createContCommand,
  createExecCommand,
  prepareContCommand,
  prepareExecCommand,
  pullAndCheckHashs,
  pullSigner,
} from '../index';

test('Expects functions to be exposed', async () => {
  expect(attachSignature).toBeDefined();
  expect(createCommand).toBeDefined();
  expect(createContCommand).toBeDefined();
  expect(createExecCommand).toBeDefined();
  expect(prepareContCommand).toBeDefined();
  expect(prepareExecCommand).toBeDefined();
  expect(pullAndCheckHashs).toBeDefined();
  expect(pullSigner).toBeDefined();
  expect(createCap).toBeDefined();
});
