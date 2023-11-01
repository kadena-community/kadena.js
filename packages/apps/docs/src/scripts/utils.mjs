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
    file: `README.md`,
    repo: 'kadena-community/getting-started',
    destination: '/build/quickstart',
    title: 'Quickstart',
    options: {
      RootOrder: 0,
      tags: ['devnet', 'chainweaver', 'tutorial', 'docker', 'transactions'],
      singlePage: true,
    },
  },
  {
    file: 'libs/chainweb-node-client/README.md',
    destination: 'chainweb/node-client',
    title: 'Node Client',
    options: {
      RootOrder: 1,
      tags: ['chainweb', 'pact', 'reference'],
    },
  },
  {
    file: 'libs/chainweb-node-client/etc/chainweb-node-client.api.md',
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
    file: 'libs/chainweb-stream-client/README.md',
    destination: 'chainweb/stream-client',
    title: 'Stream Client',
    options: {
      RootOrder: 2,
      tags: ['chainweb', 'stream', 'reference'],
    },
  },
  {
    file: 'libs/chainweb-stream-client/etc/chainweb-stream-client.api.md',
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
    file: 'libs/chainwebjs/README.md',
    destination: 'chainweb/js-bindings',
    title: 'JS bindings',
    options: {
      RootOrder: 3,
      tags: ['chainweb', 'javascript', 'typescript', 'stream'],
    },
  },
  {
    file: 'libs/chainwebjs/etc/chainwebjs.api.md',
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
    file: 'libs/client/README.md',
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
    file: 'libs/client/etc/client.api.md',
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
    file: 'libs/client-examples/README.md',
    destination: 'kadena/client-examples',
    title: 'Client examples',
    options: {
      RootOrder: 8,
      tags: ['javascript', 'typescript', 'examples', 'transfer'],
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
      tags: ['javascript', 'typescript', 'cryptography examples', 'functions'],
    },
  },
  {
    file: 'libs/cryptography-utils/etc/crypto.api.md',
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
    file: 'libs/kadena.js/README.md',
    destination: 'kadena/kadenajs',
    title: 'KadenaJS',
    options: {
      RootOrder: 6,
      tags: ['run tests', 'pact server'],
    },
  },
  /** /libs/pactjs */
  {
    file: 'libs/pactjs/README.md',
    destination: 'pact/pactjs',
    title: 'PactJS',
    options: {
      RootOrder: 6,
      tags: ['javascript', 'typescript', 'pact'],
    },
  },
  {
    file: 'libs/pactjs/etc/pactjs.api.md',
    destination: 'pact/pactjs/api',
    title: 'PactJS Api',
    options: {
      RootOrder: 98,
      hideEditLink: true,
      tags: ['javascript', 'typescript', 'pact', 'reference'],
    },
  },
  {
    file: 'libs/pactjs/etc/pactjs-utils.api.md',
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
    file: 'libs/pactjs-generator/README.md',
    destination: 'pact/pactjs-generator',
    title: 'PactJS Generator',
    options: {
      RootOrder: 7,
      tags: ['javascript', 'typescript', 'pact', 'reference', 'api'],
    },
  },
  {
    file: 'libs/pactjs-generator/etc/pactjs-generator.api.md',
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
    file: 'tools/cookbook/README.md',
    destination: 'build/cookbook/cookbook',
    title: 'JS Cookbook',
    options: {
      RootOrder: 2,
      tags: ['javascript', 'typescript', 'pact', 'reference', 'api'],
    },
  },
  /** /tools/kda-cli */
  {
    file: 'tools/kda-cli/README.md',
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
    file: 'tools/kda-cli/etc/kda-cli.api.md',
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
    file: 'tools/pactjs-cli/README.md',
    destination: 'pact/cli',
    title: 'CLI tool',
    options: {
      RootOrder: 6,
      tags: ['pactjs', 'cli', 'client', 'contracts'],
    },
  },
  {
    file: 'tools/pactjs-cli/etc/pactjs-cli.api.md',
    destination: 'pact/cli/api',
    title: 'CLI tool Api',
    options: {
      RootOrder: 99,
      hideEditLink: true,
      tags: ['pactjs', 'cli', 'client', 'contracts', 'reference'],
    },
  },
];
