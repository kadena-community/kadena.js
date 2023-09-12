export const getReadTime = (content) => {
  const WORDS_PER_MINUTE = 200;
  let result = {};
  //Matches words
  //See
  //https://regex101.com/r/q2Kqjg/6
  const regex = /\w+/g;
  result.wordCount = (content || '').match(regex).length;
  result.readingTimeInMinutes = Math.ceil(result.wordCount / WORDS_PER_MINUTE);

  return result;
};

/**
 * Files to be imported
 */
export const importReadMes = [
  /** /libs/chainweb-node-client */
  {
    file: 'libs/chainweb-node-client/README.md',
    destination: 'chainweb/node-client',
    title: 'Node Client',
    options: {
      RootOrder: 1,
    },
  },
  {
    file: 'libs/chainweb-node-client/etc/chainweb-node-client.api.md',
    destination: 'chainweb/node-client/api',
    title: 'Client Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /libs/chainweb-stream-client */
  {
    file: 'libs/chainweb-stream-client/README.md',
    destination: 'chainweb/stream-client',
    title: 'Stream Client',
    options: {
      RootOrder: 2,
    },
  },
  {
    file: 'libs/chainweb-stream-client/etc/chainweb-stream-client.api.md',
    destination: 'chainweb/stream-client/api',
    title: 'Stream Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /libs/chainwebjs */
  {
    file: 'libs/chainwebjs/README.md',
    destination: 'chainweb/js-bindings',
    title: 'JS bindings',
    options: {
      RootOrder: 3,
    },
  },
  {
    file: 'libs/chainwebjs/etc/chainwebjs.api.md',
    destination: 'chainweb/js-bindings/api',
    title: 'JS bindings API',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /libs/client */
  {
    file: 'libs/client/README.md',
    destination: 'kadena/client',
    title: 'Client',
    options: {
      RootOrder: 7,
    },
  },
  {
    file: 'libs/client/etc/client.api.md',
    destination: 'kadena/client/api',
    title: 'Client Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },

  {
    file: 'libs/client-examples/README.md',
    destination: 'kadena/client-examples',
    title: 'Client examples',
    options: {
      RootOrder: 8,
    },
  },

  /** /libs/cryptography-utils */
  {
    file: 'libs/cryptography-utils/README.md',
    destination: 'build/cryptography-utils',
    title: 'Cryptography-Utils',
    options: {
      RootOrder: 3,
    },
  },
  {
    file: 'libs/cryptography-utils/etc/cryptography-utils.api.md',
    destination: 'build/cryptography-utils/api',
    title: 'Cryptography-Utils Api',
    options: {
      RootOrder: 98,
      hideEditLink: true,
    },
  },
  {
    file: 'libs/cryptography-utils/etc/crypto.api.md',
    destination: 'build/cryptography-utils/crypto-api',
    title: 'Crypto Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /libs/kadena.js */
  {
    file: 'libs/kadena.js/README.md',
    destination: 'kadena/kadenajs',
    title: 'KadenaJS',
    options: {
      RootOrder: 6,
    },
  },
  /** /libs/pactjs */
  {
    file: 'libs/pactjs/README.md',
    destination: 'pact/pactjs',
    title: 'PactJS',
    options: {
      RootOrder: 6,
    },
  },
  {
    file: 'libs/pactjs/etc/pactjs.api.md',
    destination: 'pact/pactjs/api',
    title: 'PactJS Api',
    options: {
      RootOrder: 98,
      hideEditLink: true,
    },
  },
  {
    file: 'libs/pactjs/etc/pactjs-utils.api.md',
    destination: 'pact/pactjs/utils',
    title: 'PactJS Utils',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /libs/pactjs-generator */
  {
    file: 'libs/pactjs-generator/README.md',
    destination: 'pact/pactjs-generator',
    title: 'PactJS Generator',
    options: {
      RootOrder: 7,
    },
  },
  {
    file: 'libs/pactjs-generator/etc/pactjs-generator.api.md',
    destination: 'pact/pactjs-generator/api',
    title: 'PactJS Generator Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /tools/cookbook */
  {
    file: 'tools/cookbook/README.md',
    destination: 'build/cookbook/cookbook',
    title: 'JS Cookbook',
    options: {
      RootOrder: 2,
    },
  },
  /** /tools/kda-cli */
  {
    file: 'tools/kda-cli/README.md',
    destination: 'build/kda-cli',
    title: 'KDA CLI',
    options: {
      RootOrder: 3,
    },
  },
  {
    file: 'tools/kda-cli/etc/kda-cli.api.md',
    destination: 'build/kda-cli/api',
    title: 'KDA CLI Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
  /** /tools/pactjs-cli */
  {
    file: 'tools/pactjs-cli/README.md',
    destination: 'pact/cli',
    title: 'CLI tool',
    options: {
      RootOrder: 6,
    },
  },
  {
    file: 'tools/pactjs-cli/etc/pactjs-cli.api.md',
    destination: 'pact/cli/api',
    title: 'CLI tool Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
    },
  },
];
