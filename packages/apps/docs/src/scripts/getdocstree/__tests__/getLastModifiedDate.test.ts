import { getLastModifiedDate } from '../utils/getLastModifiedDate';

const mocks = vi.hoisted(() => {
  return {
    promiseExec: vi.fn(),
  };
});
describe('getLastModifiedDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mock('../../utils/build', async () => {
      const actual = (await vi.importActual('../../utils/build')) as {};
      return {
        ...actual,
        promiseExec: mocks.promiseExec,
      };
    });
  });

  afterEach(() => {
    vi.useFakeTimers();
    vi.resetAllMocks();
  });
  it('should return the correct lastmodified date, returned from github', async () => {
    mocks.promiseExec.mockReturnValue({ stdout: '1977-10-13' });
    const result = await getLastModifiedDate('./src/he-man.md');

    expect(result).toEqual('Thu, 13 Oct 1977 00:00:00 GMT');
  });

  it('should return current date if invalid date is returned from github', async () => {
    const date = new Date(2013, 5, 4, 13);
    vi.setSystemTime(date);
    mocks.promiseExec.mockReturnValue({ stdout: 'I have the Power' });
    const result = await getLastModifiedDate('./src/he-man.md');

    expect(result).toEqual('Tue, 04 Jun 2013 13:00:00 GMT');
  });

  it('should return currentdate date if github fails', async () => {
    const date = new Date(2013, 5, 4, 13);
    vi.setSystemTime(date);
    mocks.promiseExec.mockRejectedValue({});
    const result = await getLastModifiedDate('./src/he-man.md');

    expect(result).toEqual('Tue, 04 Jun 2013 13:00:00 GMT');
  });
});
