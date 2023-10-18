jest.mock('fs');
jest.mock('../../utils/retrieveContractFromChain');
import { Command } from 'commander';
import { writeFileSync } from 'fs';
import path from 'path';
import { retrieveContractFromChain } from '../../utils/retrieveContractFromChain';
import { retrieveContract } from '../retrieve-contract';

const mockedWriteFileSync = writeFileSync as jest.MockedFunction<
  typeof writeFileSync
>;
mockedWriteFileSync.mockImplementation(
  mockedWriteFileSync as jest.MockedFunction<typeof writeFileSync>,
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

const createAndRunProgram = async (): Promise<void> => {
  const program = new Command('retrieve-contract');
  const action = retrieveContract(program, '0.0.0');

  await action({
    out: '/some/path/to/contract.pact',
    module: 'free.crankk01',
    api: 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
    chain: 0,
    network: 'mainnet',
  });
};

describe('retrieve-contract', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('calls retrieveContractFromChain', async () => {
    mockedRetrieveContractFromChain.mockResolvedValue('some code');
    mockedWriteFileSync.mockReturnValue();
    await createAndRunProgram();

    expect(mockedRetrieveContractFromChain.mock.calls[0]).toEqual([
      'free.crankk01',
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      0,
      'mainnet',
    ]);
  });

  it('writes the contract to file', async () => {
    mockedRetrieveContractFromChain.mockResolvedValue('some code');
    mockedWriteFileSync.mockReturnValue();
    await createAndRunProgram();

    expect(mockedWriteFileSync.mock.calls[0][0]).toContain(
      path.join('some', 'path', 'to', 'contract.pact'),
    );
    expect(mockedWriteFileSync.mock.calls[0][1]).toEqual('some code');
  });
});
