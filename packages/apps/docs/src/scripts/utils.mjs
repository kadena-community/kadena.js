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

export const getValues = (tree, arr = []) => {
  tree.children.forEach((branch) => {
    if (branch.value) arr.push(branch.value.trim());
    if (!branch.children) return arr;

    return getValues(branch, arr);
  });
  return arr;
};

export const getTypes = (tree, type, arr = []) => {
  tree.children.forEach((branch) => {
    if (branch.type === type) {
      arr.push(branch);
    }
    if (!branch.children) return arr;

    return getTypes(branch, type, arr);
  });
  return arr;
};

/**
 * Files to be imported
 */
export const importReadMes = [
  /** /libs/chainweb-node-client */
  {
    file: `/README.md`,
    repo: 'https://github.com/kadena-community/getting-started',
    destination: '/build/quickstart',
    title: 'Quickstart',
    options: {
      RootOrder: 0,
      tags: ['devnet', 'chainweaver', 'tutorial', 'docker', 'transactions'],
      singlePage: true,
    },
  },
  {
    file: '/packages/libs/chainweb-node-client/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'chainweb/node-client',
    title: 'Node Client',
    options: {
      RootOrder: 1,
      tags: ['chainweb', 'pact', 'reference'],
    },
  },
  {
    file: '/packages/libs/chainweb-node-client/etc/chainweb-node-client.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'chainweb/node-client/api',
    title: 'Client Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['chainweb', 'api', 'reference'],
    },
  },
  /** /libs/chainweb-stream-client */
  {
    file: '/packages/libs/chainweb-stream-client/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'chainweb/stream-client',
    title: 'Stream Client',
    options: {
      RootOrder: 2,
      tags: ['chainweb', 'stream', 'reference'],
    },
  },
  {
    file: '/packages/libs/chainweb-stream-client/etc/chainweb-stream-client.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'chainweb/stream-client/api',
    title: 'Stream Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['chainweb', 'stream', 'reference'],
    },
  },
  /** /libs/chainwebjs */
  {
    file: '/packages/libs/chainwebjs/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'chainweb/js-bindings',
    title: 'JS bindings',
    options: {
      RootOrder: 3,
      tags: ['chainweb', 'javascript', 'typescript', 'stream'],
    },
  },
  {
    file: '/packages/libs/chainwebjs/etc/chainwebjs.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'chainweb/js-bindings/api',
    title: 'JS bindings API',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['chainweb', 'javascript', 'typescript', 'stream', 'reference'],
    },
  },
  /** /libs/client */
  {
    file: '/packages/libs/client/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'kadena/client',
    title: 'Client',
    options: {
      RootOrder: 7,
      tags: [
        'javascript',
        'typescript',
        'signing',
        'transaction',
        'typescript client',
      ],
    },
  },
  {
    file: '/packages/libs/client/etc/client.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'kadena/client/api',
    title: 'Client Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: [
        'javascript',
        'typescript',
        'signing',
        'transaction',
        'typescript client',
        'reference',
      ],
    },
  },

  {
    file: '/packages/libs/client-examples/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'kadena/client-examples',
    title: 'Client examples',
    options: {
      RootOrder: 8,
      tags: ['javascript', 'typescript', 'examples', 'transfer'],
    },
  },

  /** /libs/cryptography-utils */
  {
    file: '/packages/libs/cryptography-utils/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'build/cryptography-utils',
    title: 'Cryptography-Utils',
    options: {
      RootOrder: 3,
    },
  },
  {
    file: '/packages/libs/cryptography-utils/etc/cryptography-utils.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'build/cryptography-utils/api',
    title: 'Cryptography-Utils Api',
    options: {
      RootOrder: 98,
      hideEditLink: true,
      tags: ['javascript', 'typescript', 'cryptography examples', 'functions'],
    },
  },
  {
    file: '/packages/libs/cryptography-utils/etc/crypto.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'build/cryptography-utils/crypto-api',
    title: 'Crypto Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: [
        'javascript',
        'typescript',
        'cryptography examples',
        'functions',
        'reference',
      ],
    },
  },
  /** /libs/kadena.js */
  {
    file: '/packages/libs/kadena.js/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'kadena/kadenajs',
    title: 'KadenaJS',
    options: {
      RootOrder: 6,
      tags: ['run tests', 'pact server'],
    },
  },
  /** /libs/pactjs */
  {
    file: '/packages/libs/pactjs/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/pactjs',
    title: 'PactJS',
    options: {
      RootOrder: 6,
      tags: ['javascript', 'typescript', 'pact'],
    },
  },
  {
    file: '/packages/libs/pactjs/etc/pactjs.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/pactjs/api',
    title: 'PactJS Api',
    options: {
      RootOrder: 98,
      hideEditLink: true,
      tags: ['javascript', 'typescript', 'pact', 'reference'],
    },
  },
  {
    file: '/packages/libs/pactjs/etc/pactjs-utils.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/pactjs/utils',
    title: 'PactJS Utils',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['javascript', 'typescript', 'pact', 'reference'],
    },
  },
  /** /libs/pactjs-generator */
  {
    file: '/packages/libs/pactjs-generator/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/pactjs-generator',
    title: 'PactJS Generator',
    options: {
      RootOrder: 7,
      tags: ['javascript', 'typescript', 'pact', 'reference', 'api'],
    },
  },
  {
    file: '/packages/libs/pactjs-generator/etc/pactjs-generator.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/pactjs-generator/api',
    title: 'PactJS Generator Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['javascript', 'typescript', 'pact', 'reference', 'api'],
    },
  },
  /** /tools/cookbook */
  {
    file: '/packages/tools/cookbook/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'build/cookbook/cookbook',
    title: 'JS Cookbook',
    options: {
      RootOrder: 2,
      tags: ['javascript', 'typescript', 'pact', 'reference', 'api'],
    },
  },
  /** /tools/kda-cli */
  {
    file: '/packages/tools/kda-cli/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'build/kda-cli',
    title: 'KDA CLI',
    options: {
      RootOrder: 3,
      tags: [
        'javascript',
        'typescript',
        'kda',
        'chainweaver',
        'setup devnet',
        'cli',
        'client',
      ],
    },
  },
  {
    file: '/packages/tools/kda-cli/etc/kda-cli.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'build/kda-cli/api',
    title: 'KDA CLI Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: [
        'javascript',
        'typescript',
        'kda',
        'chainweaver',
        'setup devnet',
        'cli',
        'client',
        'reference',
      ],
    },
  },
  /** /tools/pactjs-cli */
  {
    file: '/packages/tools/pactjs-cli/README.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/cli',
    title: 'CLI tool',
    options: {
      RootOrder: 6,
      tags: ['pactjs', 'cli', 'client', 'contracts'],
    },
  },
  {
    file: '/packages/tools/pactjs-cli/etc/pactjs-cli.api.md',
    repo: 'https://github.com/kadena-community/kadena.js',
    destination: 'pact/cli/api',
    title: 'CLI tool Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['pactjs', 'cli', 'client', 'contracts', 'reference'],
    },
  },
];
