export const pactPathUrlRedirects = [
  {
    source: '/learn-pact/beginner/welcome-to-pact',
    destination: '/pact/beginner',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/atom-sdk',
    destination: '/build/pact/atom-sdk',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/:slug',
    destination: '/pact/beginner/:slug',
    permanent: true,
  },
  {
    source: '/basics/pact',
    destination: '/pact',
    permanent: true,
  },
  {
    source: '/:slug/learn-pact/beginner/:slug1',
    destination: '/pact/beginner/:slug1',
    permanent: true,
  },
  {
    source: '/learn-pact/intermediate/deploy-to-a-local-server',
    destination: '/pact/intermediate',
    permanent: true,
  },
  {
    source: '/learn-pact/intermediate/:slug',
    destination: '/pact/intermediate/:slug',
    permanent: true,
  },
  {
    source: '/:slug/learn-pact/intermediate/deploy-to-a-local-server',
    destination: '/pact/intermediate',
    permanent: true,
  },
  {
    source: '/:slug/learn-pact/intermediate/:slug1',
    destination: '/pact/intermediate/:slug1',
    permanent: true,
  },
  {
    source: '/pact/reference/pact/reference/functions',
    destination: '/pact/reference/functions',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/welcome-to-pact',
    destination: '/pact/beginner',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/welcome-to-pact',
    destination: '/pact/beginner/',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/project-rotatable-wallet',
    destination: '/pact/beginner/rotatable-wallet',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/:slug',
    destination: '/pact/beginner/:slug',
    permanent: true,
  },

  {
    source: '/learn-pact/intermediate/deploy-to-a-local-server',
    destination: '/pact/intermediate',
    permanent: true,
  },
  {
    source: '/learn-pact/intermediate/:slug',
    destination: '/pact/intermediate/:slug',
    permanent: true,
  },
  {
    source: '/learn-pact/intro',
    destination: '/pact/overview',
    permanent: true,
  },

  /* Pact Reference docs redirects */
  {
    source: '/en/latest',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    source: '/ja/latest',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    source: '/ko/latest',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    source: '/ja/stable',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    source: '/ko/stable',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    // en/latest/index.html
    source: '/:slug/:slug1/index.html',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    // en/latest/genindex.html
    source: '/:slug/:slug1/genindex.html',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    // en/latest/pact-reference.html
    source: '/:slug/:slug1/pact-reference.html',
    destination: '/pact/reference',
    permanent: true,
  },
  {
    // en/latest/pact-functions.html
    source: '/:slug/:slug1/pact-functions.html',
    destination: '/pact/reference/functions',
    permanent: true,
  },
  {
    // en/latest/pact-properties.html
    source: '/:slug/:slug1/pact-properties.html',
    destination: '/pact/reference/property-checking',
    permanent: true,
  },
  {
    // en/latest/pact-properties-api.html
    source: '/:slug/:slug1/pact-properties-api.html',
    destination: '/pact/reference/properties-and-invariants',
    permanent: true,
  },
  {
    source: '/openapi/pact.html',
    destination: '/pact/api',
    permanent: true,
  },
];
