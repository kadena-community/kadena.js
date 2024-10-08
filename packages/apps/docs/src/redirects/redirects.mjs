import { redirects } from './index.mjs';

const languages = ['en', 'es', 'ko'];

const redirectsConfig = [
  ...redirects,
  ...languages
    .map((language) => {
      return [
        {
          source: `/${language}/`,
          destination: '/',
          permanent: true,
        },
        {
          source: `/${language}/:slug`,
          destination: '/:slug',
          permanent: true,
        },
        {
          source: `/${language}/:slug/:slug1`,
          destination: '/:slug/:slug1',
          permanent: true,
        },
        {
          source: `/${language}/:slug/:slug1/:slug2`,
          destination: '/:slug/:slug1/:slug2',
          permanent: true,
        },
        {
          source: `/kadena-docs/:slug/:slug1/:slug2`,
          destination: '/:slug/:slug1/:slug2',
          permanent: true,
        },
        {
          source: `/kadena-docs/:slug/:slug1`,
          destination: '/:slug/:slug1',
          permanent: true,
        },
        {
          source: `/kadena-docs/:slug`,
          destination: '/:slug',
          permanent: true,
        },
      ];
    })
    .flat(),
];

export { redirectsConfig as default };
