export const blogchainPathUrlRedirects = [
  {
    source: '/blogchain/:slug/announcing-kadena-technical-grants.2020-11-25',
    destination:
      '/blogchain/:slug/announcing-kadena-technical-grants-2020-11-25',
    permanent: true,
  },
  {
    source: '/blogchain/2020/announcing-kadena-technical-grants',
    destination:
      '/blogchain/2020/announcing-kadena-technical-grants-2020-11-25',
    permanent: true,
  },

  {
    source: '/tags',
    destination: '/',
    permanent: true,
  },
  {
    source: '/tags/:slug',
    destination: '/',
    permanent: true,
  },
  {
    source: '/authors',
    destination: '/',
    permanent: true,
  },
  {
    source: '/authors/:slug',
    destination: '/',
    permanent: true,
  },
  {
    source: '/blogchain',
    destination: 'https://www.kadena.io/blog',
    permanent: true,
  },
  {
    source: '/blogchain/:slug',
    destination: 'https://www.kadena.io/blog',
    permanent: true,
  },
  {
    source: '/blogchain/:slug/:slug2',
    destination: 'https://www.kadena.io/blog',
    permanent: true,
  },
];
