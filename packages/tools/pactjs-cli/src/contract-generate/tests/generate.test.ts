jest.mock('../../utils/retrieveContractFromChain');

const mockedStringContractDefinition = jest.fn().mockReturnValue({
  modulesWithFunctions: {
    crankk01: {},
  },
});
const mockedFileContractDefinition = jest.fn().mockReturnValue({
  modulesWithFunctions: {
    crankk01: {},
  },
});
const mockedGenerateDts = jest.fn().mockReturnValue([]);

jest.mock('@kadena/pactjs-generator', () => ({
  ...jest.requireActual('@kadena/pactjs-generator'),
  StringContractDefinition: mockedStringContractDefinition,
  FileContractDefinition: mockedFileContractDefinition,
  generateDts: mockedGenerateDts,
}));

import { retrieveContractFromChain } from '../../utils/retrieveContractFromChain';
import { generate } from '../generate';
import { ContractGenerateOptions } from '..';

import { mockContract } from './mockdata/contract';

import { Command, program } from 'commander';

const mockedRetrieveContractFromChain =
  retrieveContractFromChain as jest.MockedFunction<
    typeof retrieveContractFromChain
  >;
mockedRetrieveContractFromChain.mockResolvedValue(mockContract);

const mockProgramError = jest.fn() as jest.Mock<typeof program.error>;

// silence console.log
jest.spyOn(console, 'log').mockImplementation(() => {});

const createAndRunProgram = async (
  type: 'file' | 'chain',
  options?: Partial<ContractGenerateOptions>,
): Promise<void> => {
  const program = new Command('generate');
  (program.error as unknown) = mockProgramError;
  const action = generate(program, '0.0.0');
  let result;

  if (type === 'file') {
    result = action({
      file: 'some/path/to/contract.pact',
      ...options,
    });
  }

  if (type === 'chain') {
    result = action({
      contract: 'free.crankk01',
      api: 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      chain: 0,
      network: 'mainnet',
      ...options,
    });
  }

  return result;
};

describe('generate', () => {
  afterAll(() => {
    mockedRetrieveContractFromChain.mockRestore();
    mockedGenerateDts.mockRestore();
  });

  describe('for a contract from a file', () => {
    afterEach(() => {
      mockedRetrieveContractFromChain.mockClear();
      mockedGenerateDts.mockClear();
    });

    it('calls generateDts with the right module and capsInterface', async () => {
      await createAndRunProgram('file');

      expect(Object.keys(mockedGenerateDts.mock.calls[0][0])).toEqual([
        'crankk01',
      ]);

      expect(mockedGenerateDts.mock.calls[0][1]).toBeUndefined();
    });
  });
  describe('for a contract from chain', () => {
    afterEach(() => {
      mockedRetrieveContractFromChain.mockReset();
    });

    it('allows the user to overwrite the default chain', async () => {
      await createAndRunProgram('chain', { chain: 4 });

      expect(mockedRetrieveContractFromChain.mock.calls[0][2]).toBe(4);
    });

    it('allows the user to overwrite the default network', async () => {
      await createAndRunProgram('chain', { network: 'testnet' });

      expect(mockedRetrieveContractFromChain.mock.calls[0][3]).toBe('testnet');
    });

    it('calls retrieveContractFromChain to read the contract from the chain', async () => {
      await createAndRunProgram('chain');

      expect(mockedRetrieveContractFromChain.mock.calls[0][0]).toContain(
        'free.crankk01',
      );

      expect(mockedRetrieveContractFromChain.mock.calls[0][1]).toBe(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      );
    });

    it('fails gracefully when the contract cannot be fetched', async () => {
      mockedRetrieveContractFromChain.mockResolvedValue(undefined);

      const result = await createAndRunProgram('chain');

      expect(mockedRetrieveContractFromChain.mock.calls[0][0]).toContain(
        'free.crankk01',
      );
      expect(mockProgramError.mock.calls[0][0]).toBe(
        'Could not retrieve contract from chain',
      );

      expect(result).toBeUndefined();
    });

    it('sets the namespace to the one supplied', async () => {
      await createAndRunProgram('chain');

      expect(mockedStringContractDefinition.mock.calls[0][1]).toBe('free');
    });

    it("sets the namespace to undefined when there isn't one", async () => {
      await createAndRunProgram('chain', { contract: 'coin' });

      expect(mockedStringContractDefinition.mock.calls[0][1]).toBeUndefined();
    });

    it('calls generateDts with the right module', async () => {
      await createAndRunProgram('chain');

      expect(Object.keys(mockedGenerateDts.mock.calls[0][0])).toEqual([
        'crankk01',
      ]);
    });
  });
});
