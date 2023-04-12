import {
  listen,
  poll,
  send,
  spv,
  local,
  createSendRequest,
  createPollRequest,
  createListenRequest,
  mkCap,
  parseResponse,
  parseResponseTEXT,
  stringifyAndMakePOSTRequest,
} from '../';

test('Expects functions to be exposed', async () => {
  expect(listen).toBeDefined();
  expect(poll).toBeDefined();
  expect(send).toBeDefined();
  expect(spv).toBeDefined();
  expect(local).toBeDefined();
  expect(mkCap).toBeDefined();
  expect(parseResponse).toBeDefined();
  expect(parseResponseTEXT).toBeDefined();
  expect(stringifyAndMakePOSTRequest).toBeDefined();
  expect(createListenRequest).toBeDefined();
  expect(createPollRequest).toBeDefined();
  expect(createSendRequest).toBeDefined();
});
