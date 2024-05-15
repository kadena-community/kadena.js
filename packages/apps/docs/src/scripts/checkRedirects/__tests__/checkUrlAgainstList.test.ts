import { checkUrlAgainstList } from '../';

describe('checkUrlAgainstList', () => {
  it('should return the correct url when there is no :slug', async () => {
    const url = '/kadena/test';
    const expectedResult = '/kadena2/test2';
    const urlList = [
      {
        source: url,
        destination: expectedResult,
        permanent: true,
      },
    ];

    const result = checkUrlAgainstList(url, urlList);
    expect(result).toEqual([expectedResult]);
  });

  it('should return the correct url with 1 :slug', async () => {
    const url = '/kadena/test';
    const expectedResult = '/kadena2/test';
    const urlList = [
      {
        source: '/kadena/:slug',
        destination: '/kadena2/:slug',
        permanent: true,
      },
    ];

    const result = checkUrlAgainstList(url, urlList);
    expect(result).toEqual([expectedResult]);
  });

  it('should return the correct url with multiple :slugs', async () => {
    const url = '/kadena/he-man/skeletor/greyskull';
    const expectedResult = '/kadena2/he-man/skeletor/greyskull';
    const urlList = [
      {
        source: '/kadena/:slug/:test/:moreslug',
        destination: '/kadena2/:slug/:test/:moreslug',
        permanent: true,
      },
    ];

    const result = checkUrlAgainstList(url, urlList);
    expect(result).toEqual([expectedResult]);
  });

  it('should return the correct url with multiple :slugs in different order', async () => {
    const url = '/kadena/he-man/skeletor/greyskull';
    const expectedResult = '/kadena2/greyskull/skeletor/he-man';
    const urlList = [
      {
        source: '/kadena/:slug/:test/:moreslug',
        destination: '/kadena2/:moreslug/:test/:slug',
        permanent: true,
      },
    ];

    const result = checkUrlAgainstList(url, urlList);
    expect(result).toEqual([expectedResult]);
  });

  it('should an url when slugs do not correspond', async () => {
    const url = '/kadena/he-man/skeletor';
    const urlList = [
      {
        source: '/kadena/:slug/:test',
        destination: '/kadena2/:moreslug/:test/:slug',
        permanent: true,
      },
    ];

    const result = checkUrlAgainstList(url, urlList);
    expect(result).toEqual([]);
  });

  it('should say that the redirec when its outgoing to different url', async () => {
    const url = '/kadena/he-man/skeletor';
    const urlList = [
      {
        source: '/kadena/:slug/:test',
        destination: 'https://kadena.io/blog/',
        permanent: true,
      },
    ];

    const result = checkUrlAgainstList(url, urlList);
    expect(result).toEqual(['https://kadena.io/blog/']);
  });
});
