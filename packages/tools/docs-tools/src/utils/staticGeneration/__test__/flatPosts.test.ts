import type { IMenuData } from 'src';
import { flattenData, getFlatData } from './../flatPosts';

const data = [
  {
    children: [
      {
        children: [
          {
            children: [],
            root: '/kadena/whitepapers/chainweb-layer-1',
          },
          {
            children: [],
            root: '/kadena/whitepapers/pact-smart-contract-language',
          },
        ],
        root: '/kadena/whitepapers',
      },
    ],
  },
] as unknown as IMenuData[];

describe('utils flattenData', () => {
  it('should return a flattened array of the menu structure given', async () => {
    const result = flattenData(data);
    const expectedResult = [
      {},
      { root: '/kadena/whitepapers' },
      { root: '/kadena/whitepapers/chainweb-layer-1' },
      { root: '/kadena/whitepapers/pact-smart-contract-language' },
    ];

    expect(result).toStrictEqual(expectedResult);
  });
});

describe('utils getFlatData', () => {
  beforeAll(() => {
    vi.mock('fs/promises', async () => {
      const actual = (await vi.importActual('fs/promises')) as {};
      return {
        default: {
          ...actual,
          readFile: async (file: string) => {
            return JSON.stringify(data);
          },
        },
      };
    });
  });

  it('should return a flattened array of the menu structure that is loaded in the function', async () => {
    const result = await getFlatData();
    const expectedResult = [
      {},
      { root: '/kadena/whitepapers' },
      { root: '/kadena/whitepapers/chainweb-layer-1' },
      { root: '/kadena/whitepapers/pact-smart-contract-language' },
    ];

    expect(result).toStrictEqual(expectedResult);
  });
});
