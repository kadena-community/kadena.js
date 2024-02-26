export const pactPathUrlRedirects = [
  {
    source: '/learn-pact/beginner/welcome-to-pact',
    destination: '/pact/beginner',
    permanent: true,
  },
  {
    source: '/learn-pact/beginner/:slug',
    destination: '/pact/beginner/:slug',
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
];
