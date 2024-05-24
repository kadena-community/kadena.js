import { createSitemap } from '..';

const mocks = vi.hoisted(() => {
  return {
    writeFileSync: vi.fn(),
    getFlatData: vi.fn(),
    getChangelogs: vi.fn(),
    getPosts: vi.fn(),
  };
});
describe('createSitemap', () => {
  beforeEach(() => {
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        writeFileSync: mocks.writeFileSync,
      };
    });
    vi.mock('@kadena/docs-tools', async () => {
      const actual = (await vi.importActual('@kadena/docs-tools')) as {};
      return {
        ...actual,
        getFlatData: mocks.getFlatData,
      };
    });
    vi.mock('./../utils/getPosts', async () => {
      return {
        getPosts: mocks.getPosts.mockReturnValue([]),
      };
    });
    vi.mock('./../utils/getChangelogs', async () => {
      return {
        getChangelogs: mocks.getChangelogs.mockReturnValue([]),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call the correct functions that will fill the content', async () => {
    const { success, errors } = await createSitemap();

    expect(mocks.writeFileSync).toBeCalledTimes(1);
    expect(mocks.getFlatData).toBeCalledTimes(1);
    expect(mocks.getPosts).toBeCalledTimes(1);
    expect(mocks.getChangelogs).toBeCalledTimes(1);
    expect(errors.length).toEqual(0);
    expect(success.length).toEqual(1);
    expect(success[0]).toEqual('sitemap successfully created');
  });

  it('should return errors when something went wrong', async () => {
    mocks.getFlatData.mockRejectedValue(-1);
    const { success, errors } = await createSitemap();

    expect(mocks.writeFileSync).toBeCalledTimes(0);
    expect(errors.length).toEqual(1);
    console.log(success);
    expect(success.length).toEqual(0);
    expect(errors[0]).toEqual('Something went wrong');
  });
});
