import fsPromises from 'fs/promises';
import storeAnalyticsData from '../storeAnalyticsData';

const mocks = vi.hoisted(() => {
  return {
    writeFile: vi.fn(),
  };
});
describe('storeAnalyticsData', () => {
  beforeEach(() => {
    vi.mock('fs/promises', async () => {
      const actual = (await vi.importActual('fs/promises')) as {};
      return {
        ...actual,
        default: {
          writeFile: mocks.writeFile,
        },
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should write the data to the correct file', async () => {
    mocks.writeFile.mockImplementation(
      async (filePath: string, data: string) => {},
    );

    const spy = vi.spyOn(fsPromises, 'writeFile');
    await storeAnalyticsData('test.json', 'test data');
    expect(spy).toHaveBeenCalledWith('test.json', 'test data', 'utf8');
  });
});
