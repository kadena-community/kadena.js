export const version2PathUrlRedirects = [
  {
    source: '/kadena/:slug',
    destination: '/learn/:slug',
    permanent: true,
  },
  {
    source: '/pact/reference/:slug1/:slug2',
    destination: '/reference/:slug1/:slug2',
    permanent: true,
  },
  {
    source: '/pact/reference/:slug1/:slug2/:slug3',
    destination: '/reference/:slug1/:slug2/:slug3',
    permanent: true,
  },
  {
    source: '/pact/reference/properties-and-invariants/:slug',
    destination: '/reference/property-checking/:slug',
    permanent: true,
  },
  {
    source: '/pact/reference/properties-and-invariants/object-operators',
    destination: '/reference/property-checking/object',
    permanent: true,
  },
  {
    source: '/pact/reference/properties-and-invariants/logical-operators',
    destination: '/reference/property-checking/logical',
    permanent: true,
  },
];
