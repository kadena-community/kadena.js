import { getCurrentPostFromJson } from '../getCurrentPostFromJson';
import { getData as getDataMocked } from './../../../mock/getData.mock';

vi.mock('./../../../utils/staticGeneration/getData', () => {
  return {
    getData: async () => {
      return getDataMocked();
    },
  };
});

describe('getCurrentPostFromJson', () => {
  it('should return the correct menudata object for given root', async () => {
    const result = await getCurrentPostFromJson(
      '/reference/chainweb-ref/js-bindings',
    );
    const expectedResult = {
      root: '/reference/chainweb-ref/js-bindings',
      lastModifiedDate: 'Fri, 31 May 2024 11:40:11 GMT',
      title: 'JavaScript client API',
      description:
        'The Chainweb JavaScript client API provides a TypeScript based application programming interface API for calling Chainweb node endpoints.',
      menu: 'Chainweb REST API',
      label: 'Bindings and types',
      order: 3,
      layout: 'full',
      tags: ['TypeScript', 'Kadena client', 'frontend'],
      wordCount: 1079,
      readingTimeInMinutes: 6,
      isMenuOpen: false,
      isActive: false,
      isIndex: true,
    };
    expect(result).toEqual(expectedResult);
  });
});
