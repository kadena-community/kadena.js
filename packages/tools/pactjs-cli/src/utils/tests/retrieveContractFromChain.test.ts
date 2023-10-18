jest.mock('../callLocal.ts');
import { callLocal } from '../callLocal';
import { retrieveContractFromChain } from '../retrieveContractFromChain';

const mockedCallLocal = callLocal as jest.MockedFunction<typeof callLocal>;

describe('retrieveContractFromChain', () => {
  afterAll(() => {
    mockedCallLocal.mockRestore();
  });

  it('returns the pactCode on success', async () => {
    mockedCallLocal.mockResolvedValue({
      textResponse: 'some pactText',
      jsonResponse: { result: { data: { code: 'some pactCode' } } },
      response: { status: 200 } as Response,
    });

    const result = await retrieveContractFromChain(
      'free.crankk01',
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      0,
      'mainnet',
    );

    expect(result).toBe('some pactCode');
  });
});
