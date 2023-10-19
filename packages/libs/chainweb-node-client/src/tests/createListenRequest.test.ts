import { createListenRequest } from '../createListenRequest';
import { createSendRequest } from '../createSendRequest';
import { command } from './mockdata/execCommand';

test('Takes in command formatted for /send endpoint and outputs request for /listen endpoint', () => {
  const actual = createListenRequest(createSendRequest(command));
  const expected = {
    listen: command.hash,
  };

  expect(expected).toEqual(actual);
});
