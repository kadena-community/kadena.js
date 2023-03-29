jest.mock('fs');
jest.mock('cross-fetch');
jest.mock('../../utils/retrieveContractFromChain');

import { retrieveContractFromChain } from '../../utils/retrieveContractFromChain';
import { generate } from '../generate';

import { mockContract } from './mockdata/contract';

import { Command, program } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const mockedReadFileSync = readFileSync as jest.MockedFunction<
  typeof readFileSync
>;
mockedReadFileSync.mockImplementation(
  mockedReadFileSync as jest.MockedFunction<typeof readFileSync>,
);

const mockedWriteFileSync = writeFileSync as jest.MockedFunction<
  typeof writeFileSync
>;
mockedWriteFileSync.mockImplementation(
  mockedWriteFileSync as jest.MockedFunction<typeof writeFileSync>,
);

const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
mockedExistsSync.mockImplementation(
  mockedExistsSync as jest.MockedFunction<typeof existsSync>,
);

const mockedRetrieveContractFromChain =
  retrieveContractFromChain as jest.MockedFunction<
    typeof retrieveContractFromChain
  >;
mockedRetrieveContractFromChain.mockImplementation(
  mockedRetrieveContractFromChain as jest.MockedFunction<
    typeof retrieveContractFromChain
  >,
);

const mockProgramError = jest.fn() as jest.Mock<typeof program.error>;

// silence console.log
jest.spyOn(console, 'log').mockImplementation(() => {});

const createAndRunProgram = async (type: 'file' | 'chain'): Promise<void> => {
  const program = new Command('generate');
  (program.error as unknown) = mockProgramError;
  const action = generate(program, '0.0.0');
  let result;

  if (type === 'file') {
    result = await action({
      file: 'some/path/to/contract.pact',
      clean: false,
      capsInterface: undefined,
    });
  }

  if (type === 'chain') {
    result = await action({
      contract: 'free.crankk01',
      api: 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      chain: 0,
      network: 'mainnet',
      clean: false,
      capsInterface: undefined,
    });
  }

  return result;
};

describe('generate', () => {
  afterAll(() => {
    mockedExistsSync.mockRestore();
    mockedWriteFileSync.mockRestore();
    mockedReadFileSync.mockRestore();
    mockedRetrieveContractFromChain.mockRestore();
  });

  describe('for a contract from a file', () => {
    beforeEach(() => {
      mockedReadFileSync.mockReturnValue(mockContract);
      mockedExistsSync.mockReturnValue(true);
      mockedWriteFileSync.mockReturnValue();
    });

    afterEach(() => {
      mockedReadFileSync.mockReset();
      mockedExistsSync.mockReset();
      mockedWriteFileSync.mockReset();
      mockedRetrieveContractFromChain.mockReset();
    });

    it('reads the contract from the file', async () => {
      await createAndRunProgram('file');

      expect(mockedReadFileSync.mock.calls[0][0]).toContain(
        '/some/path/to/contract.pact',
      );
    });

    it('writes the d.ts files', async () => {
      await createAndRunProgram('file');

      expect(mockedWriteFileSync.mock.calls[0][0]).toContain(
        '/node_modules/.kadena/pactjs-generated/crankk01.d.ts',
      );

      expect(mockedWriteFileSync.mock.calls[1][0]).toContain(
        '/node_modules/.kadena/pactjs-generated/index.d.ts',
      );
    });
  });
  describe('for a contract from chain', () => {
    beforeEach(() => {
      mockedReadFileSync.mockReturnValue('{}'); // package.json and tsconfig.json
      mockedExistsSync.mockReturnValue(true);
      mockedWriteFileSync.mockReturnValue();
      mockedRetrieveContractFromChain.mockResolvedValue(mockContract);
    });

    afterEach(() => {
      mockedReadFileSync.mockReset();
      mockedExistsSync.mockReset();
      mockedWriteFileSync.mockReset();
      mockedRetrieveContractFromChain.mockReset();
    });

    it('calls retrieveContractFromChain to read the contract from the chain', async () => {
      await createAndRunProgram('chain');

      expect(mockedRetrieveContractFromChain.mock.calls[0][0]).toContain(
        'free.crankk01',
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

    it('writes the d.ts files', async () => {
      await createAndRunProgram('chain');

      expect(mockedWriteFileSync.mock.calls[0][0]).toContain(
        '/node_modules/.kadena/pactjs-generated/crankk01.d.ts',
      );

      expect(mockedWriteFileSync.mock.calls[1][0]).toContain(
        '/node_modules/.kadena/pactjs-generated/index.d.ts',
      );
    });
  });
});
