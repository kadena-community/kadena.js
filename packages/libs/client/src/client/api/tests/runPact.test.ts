jest.mock('@kadena/chainweb-node-client', () => ({
  __esModule: true,
  ...jest.requireActual('@kadena/chainweb-node-client'),
  local: jest.fn(),
}));
import { local } from '@kadena/chainweb-node-client';
import { runPact } from '../runPact';

jest.useFakeTimers().setSystemTime(new Date('2023-07-31'));

describe('runPact', () => {
  it('create a complete pact command from the input and send it to the chain', async () => {
    const response = 'local-response';
    (local as jest.Mock).mockResolvedValue(response);

    const result = await runPact('http://blockchain', '(+ 1 1)');

    expect(result).toBe(response);

    expect(local).toBeCalledWith(
      {
        cmd: '{"payload":{"exec":{"code":"(+ 1 1)","data":{}}},"nonce":"kjs:nonce:1690761600000","signers":[]}',
        hash: 'BFstB5srkwenVbxQYjMsdSIQiyaakhaYGjHA3ZKmntY',
        sigs: [],
      },
      'http://blockchain',
      { preflight: false, signatureVerification: false },
    );
  });
});
