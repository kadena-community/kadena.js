export const rootPathUrlRedirects = [
  {
    source: 'whitepapers/:slug',
    destination: 'kadena/resources',
    permanent: true,
  },
  {
    source: 'whitepapers/:slug',
    destination: 'kadena/resources',
    permanent: true,
  },
  {
    source: '/kadena-docs/faq',
    destination: '/kadena/kadena-faq',
  },
  {
    source: '/kadena-docs/faq/:slug',
    destination: '/kadena/kadena-faq',
  },
  {
    source: '/contribute/code-of-conduct',
    destination: '/kadena/code-of-conduct',
    permanent: true,
  },
  {
    source: '/:slug/contribute/code-of-conduct',
    destination: '/kadena/code-of-conduct',
    permanent: true,
  },
];
