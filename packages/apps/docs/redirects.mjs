const redirectsConfig = [
  {
    source: '/basics/kda/what-is-kda',
    destination: '/kadena/kda/',
    permanent: true,
  },
  {
    source: '/basics/kda/:slug',
    destination: '/kadena/kda/:slug',
    permanent: true,
  },
  {
    source: '/basics/wallets',
    destination: '/kadena/wallets',
    permanent: true,
  },
  {
    source: '/basics/chainweaver/chainweaver-user-guide',
    destination: '/kadena/wallets/chainweaver',
    permanent: true,
  },
  {
    source: '/basics/chainweaver/:slug',
    destination: '/kadena/wallets/chainweaver/:slug',
    permanent: true,
  },
  {
    source: '/basics/ledger/ledger-user-guide',
    destination: '/kadena/wallets/ledger',
    permanent: true,
  },
  {
    source: '/basics/exchanges',
    destination: '/kadena/exchanges',
    permanent: true,
  },
  {
    source: '/basics/whitepapers/overview',
    destination: '/kadena/whitepapers',
    permanent: true,
  },
  {
    source: '/basics/whitepapers/:slug',
    destination: '/kadena/whitepapers/:slug',
    permanent: true,
  },
  {
    source: '/basics/faq',
    destination: '/kadena/support',
    permanent: true,
  },
  {
    source: '/basics/resources/official-links',
    destination: '/kadena/resources',
    permanent: true,
  },
  {
    source: '/basics/resources/:slug',
    destination: '/kadena/resources/:slug',
    permanent: true,
  },
  {
    source: '/basics/quickstart',
    destination: '/build/quickstart',
    permanent: true,
  },
  {
    source: '/basics/support/:slug',
    destination: '/kadena/support/:slug',
    permanent: true,
  },
  {
    source: '/build/introduction',
    destination: '/build',
    permanent: true,
  },
  {
    source: '/build/guides/a-step-by-step-guide-to-writing-pact-smart-contract',
    destination: '/build/guides',
    permanent: true,
  },
  {
    source: '/build/guides/building-a-voting-dapp',
    destination: '/build/guides/election-dapp-tutorial',
    permanent: true,
  },
  {
    source: '/build/frontend/pact-lang-api-cookbook',
    destination: '/build/cookbook',
    permanent: true,
  },
  {
    source: '/build/resources/developer-program',
    destination: '/kadena/support/developer-program',
    permanent: true,
  },
  {
    source: '/build/resources/technical-grants',
    destination: '/kadena/support/technical-grants',
    permanent: true,
  },
  {
    source: '/contribute/node/overview',
    destination: '/contribute/node',
    permanent: true,
  },
  {
    source: '/contribute/ambassadors/overview',
    destination: '/contribute/ambassadors',
    permanent: true,
  },
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
    source: '/learn-pact/intermediate/deploy-to-a-local-server',
    destination: '/pact/intermediate',
    permanent: true,
  },
  {
    source: '/learn-pact/intermediate/:slug',
    destination: '/pact/intermediate/:slug',
    permanent: true,
  },
];

export { redirectsConfig as default };
