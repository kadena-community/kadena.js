import { createPactDocs } from '..';

const mocks = vi.hoisted(() => {
  return {
    loadConfigPages: vi.fn(),
    copyPages: vi.fn(),
  };
});

describe('createPactDocs', () => {
  beforeEach(() => {
    vi.mock('./../utils/copyPages', () => ({
      copyPages: mocks.copyPages,
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should run the correct functions and return success', async () => {
    mocks.copyPages.mockResolvedValue({});
    const { errors, success } = await createPactDocs();

    expect(success.length).toEqual(1);
    expect(success[0]).toEqual('pact docs created');
    expect(errors.length).toEqual(0);
  });

  it('should run the correct functions and return errors when copy goes wrong', async () => {
    mocks.copyPages.mockRejectedValue('there was an issue');
    const { errors, success } = await createPactDocs();

    expect(success.length).toEqual(0);
    expect(errors.length).toEqual(1);
  });
});
