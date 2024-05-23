import { loadConfigPages } from '@/scripts/movePages/utils/loadConfigPages';
import fsPromises from 'fs/promises';
//import config from '../../__mocks__/config.mock.yaml' assert { type: 'yaml' };
import { CONTENTPLACEHOLDER } from '../utils/constants';
import { copyPages } from '../utils/copyPages';

const mocks = vi.hoisted(() => {
  return {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    noImportRepo: vi.fn(),
    importRepo: vi.fn(),
  };
});

describe('copyPages', () => {
  beforeEach(() => {
    vi.mock('@/scripts/importReadme/importRepo', async () => {
      return {
        noImportRepo: mocks.noImportRepo,
      };
    });
    vi.mock('../utils/importRepo', async () => {
      return {
        importRepo: mocks.importRepo,
      };
    });
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: mocks.readFileSync,
        writeFileSync: mocks.writeFileSync,
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should write the repo content 11 times', async () => {
    vi.stubEnv('IGNOREREPO', 'true');
    const config = await fsPromises.readFile(
      './src/scripts/__mocks__/config.mock.yaml',
      'utf-8',
    );

    mocks.noImportRepo.mockReturnValue('new content');
    mocks.readFileSync.mockReturnValueOnce(config);
    mocks.readFileSync.mockReturnValue('this is the content');
    await copyPages(loadConfigPages());
    expect(mocks.writeFileSync).toBeCalledTimes(11);
    expect(mocks.writeFileSync).toHaveBeenNthCalledWith(
      1,
      './src/pages/reference/functions/general/index.md',
      'this is the content',
    );
  });

  it('should write replace the placeholder with the content', async () => {
    vi.stubEnv('IGNOREREPO', 'false');
    const config = await fsPromises.readFile(
      './src/scripts/__mocks__/config.mock.yaml',
      'utf-8',
    );

    mocks.importRepo.mockReturnValue('I Have the Powerrrr');
    mocks.readFileSync.mockReturnValueOnce(config);
    mocks.readFileSync.mockReturnValue(
      `He-man ${CONTENTPLACEHOLDER}. Masters of the universe`,
    );
    await copyPages(loadConfigPages());
    expect(mocks.writeFileSync).toBeCalledTimes(11);
    expect(mocks.writeFileSync).toHaveBeenNthCalledWith(
      2,
      './src/pages/reference/functions/database/index.md',
      'He-man I Have the Powerrrr. Masters of the universe',
    );
  });
});
