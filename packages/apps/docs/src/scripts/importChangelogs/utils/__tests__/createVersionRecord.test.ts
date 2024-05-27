import { createVersionRecord } from '../createVersionRecord';

const mocks = vi.hoisted(() => {
  return {
    crawlContent: vi.fn(),
  };
});
describe('createVersionRecord', () => {
  const node = {
    type: 'listItem',
    spread: false,
    checked: null,
    children: [{ type: 'paragraph', children: [] }],
    position: {
      start: { line: 666, column: 1, offset: 22271 },
      end: { line: 666, column: 47, offset: 22317 },
    },
  };

  beforeEach(() => {
    vi.mock('./../crawlContent', () => ({
      crawlContent: mocks.crawlContent,
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return a version object with empty commits and prs arrays', () => {
    mocks.crawlContent.mockReturnValue(
      'Support for types: inference, runtime enforcement, typechecking',
    );

    const expectedResult = {
      commits: [],
      prIds: [],
      label: 'Support for types: inference, runtime enforcement, typechecking',
    };
    const result = createVersionRecord(node);
    expect(result).toEqual(expectedResult);
  });

  it('should return a version object with no commits array but with 3 prs in array', () => {
    mocks.crawlContent.mockReturnValue(
      'Fixed issue with the hash of cap guards, hash native and principals (#1273) (#1278) (#1287)',
    );

    const expectedResult = {
      prIds: [
        {
          commits: [],
          tries: 0,
          id: 1273,
        },
        {
          commits: [],
          tries: 0,
          id: 1278,
        },
        {
          commits: [],
          tries: 0,
          id: 1287,
        },
      ],
      commits: [],
      label:
        'Fixed issue with the hash of cap guards, hash native and principals',
    };
    const result = createVersionRecord(node);
    expect(result).toEqual(expectedResult);
  });

  it('should return a version object with no prs array but with 1 commit in array', () => {
    mocks.crawlContent.mockReturnValue(
      'Updated(#1273) (#1278)dependencies [c756c1425]',
    );

    const expectedResult = {
      prIds: [
        {
          commits: [],
          tries: 0,
          id: 1273,
        },
        {
          commits: [],
          tries: 0,
          id: 1278,
        },
      ],
      commits: [
        {
          tries: 0,
          hash: 'c756c1425',
        },
      ],
      label: 'Updated dependencies',
    };
    const result = createVersionRecord(node);
    expect(result).toEqual(expectedResult);
  });

  it('should return a version object with 2 prs array and with 1 commit in array', () => {
    mocks.crawlContent.mockReturnValue('Updated dependencies [c756c1425]');

    const expectedResult = {
      prIds: [],
      commits: [
        {
          tries: 0,
          hash: 'c756c1425',
        },
      ],
      label: 'Updated dependencies',
    };
    const result = createVersionRecord(node);
    expect(result).toEqual(expectedResult);
  });
});
