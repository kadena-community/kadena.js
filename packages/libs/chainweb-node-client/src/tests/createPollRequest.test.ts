import { createPollRequest } from '../createPollRequest';
import { createSendRequest } from '../createSendRequest';
import { command } from './mockdata/execCommand';

test('Takes in command formatted for /send endpoint and outputs request for /poll endpoint', () => {
  const actual = createPollRequest(createSendRequest(command));
  const expected = {
    requestKeys: [command.hash],
  };

  expect(expected).toEqual(actual);
});
