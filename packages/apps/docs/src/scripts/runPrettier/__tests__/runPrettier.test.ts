import { runPrettier } from '..';

const mocks = vi.hoisted(() => {
  return {
    promiseExec: vi.fn(),
  };
});

describe('runPrettier', () => {
  beforeEach(() => {
    vi.mock('../../utils/build', () => ({
      promiseExec: mocks.promiseExec,
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should run prettier with a success', async () => {
    mocks.promiseExec.mockResolvedValue({ stdout: 'true' });
    const result = await runPrettier();
    expect(result.success.length).toEqual(1);
    expect(result.success[0]).toEqual('Prettier done!!');
  });
  it('should run prettier with an error', async () => {
    mocks.promiseExec.mockResolvedValue({ stderr: 'BIG ERROR' });
    const result = await runPrettier();
    expect(result.errors.length).toEqual(1);
    expect(result.errors[0]).toEqual('Prettier had issues: BIG ERROR');
  });
});
