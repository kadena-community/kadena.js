import type { IMenuData } from 'src';
import { getData } from './../getData';

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
  {
    children: [],
  },
] as unknown as IMenuData[];

describe('utils getData', () => {
  beforeEach(() => {
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

  it('should return the menu data', async () => {
    const result = await getData();
    const expectedResult = data;

    expect(result).toStrictEqual(expectedResult);
  });
});
