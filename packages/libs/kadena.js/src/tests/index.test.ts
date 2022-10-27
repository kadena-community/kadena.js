import {
  attachSignature,
  createCap,
  createCommand,
  createContCommand,
  createExecCommand,
  createListenRequest,
  createPollRequest,
  createSendRequest,
  prepareContCommand,
  prepareExecCommand,
  pullAndCheckHashs,
  pullSignature,
  pullSigner,
} from '../index';

test('Expects functions to be exposed', async () => {
  expect(attachSignature).toBeDefined();
  expect(createCommand).toBeDefined();
  expect(createContCommand).toBeDefined();
  expect(createExecCommand).toBeDefined();
  expect(createListenRequest).toBeDefined();
  expect(createPollRequest).toBeDefined();
  expect(createSendRequest).toBeDefined();
  expect(prepareContCommand).toBeDefined();
  expect(prepareExecCommand).toBeDefined();
  expect(pullAndCheckHashs).toBeDefined();
  expect(pullSignature).toBeDefined();
  expect(pullSigner).toBeDefined();
  expect(createCap).toBeDefined();
});
