import * as fs from 'fs';
import 'dotenv/config';
import { remark } from 'remark';
import { toMarkdown } from 'mdast-util-to-markdown';

const DOCSROOT = './src/pages/docs/';

const createFrontMatter = (title, menuTitle, order, editLink) => {
  return `---
title: ${title}
description: Kadena makes blockchain work for everyone.
menu: ${menuTitle}
label: ${title}
order: ${order}
editLink: ${editLink}
layout: full
---
`;
};
const getTypes = (tree, type, arr = []) => {
  tree.children.forEach((branch) => {
    if (branch.type === type) {
      arr.push(branch);
    }
    if (!branch.children) return arr;

    return getTypes(branch, type, arr);
  });
  return arr;
};

const createEditOverwrite = (filename, options) => {
  if (options.hideEditLink) return '';
  return `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/${filename}`;
};

export const createSlug = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};

const getTitle = (pageAST) => {
  const node = pageAST.children[0];
  if (node.type !== 'heading' || node.depth !== 2) {
    throw new Error('first node is not a Heading');
  }

  return node.children[0].value;
};

const createTreeRoot = (page) => ({
  type: 'root',
  children: page,
});

const createDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const divideIntoPages = (md) => {
  const pages = md.children.reduce((acc, val) => {
    if (val.type === 'heading' && val.depth === 2) {
      acc.push([val]);
    } else {
      if (acc.length) {
        acc[acc.length - 1].push(val);
      }
    }

    return acc;
  }, []);

  const rootedPages = pages.map((page) => createTreeRoot(page));

  return rootedPages;
};

// find the correct title
// if the title is a h2 (start of the new page)
const findHeading = (tree, slug) => {
  const headings = getTypes(tree, 'heading');

  const heading = headings.find((heading) => {
    return createSlug(heading.children[0].value) === slug;
  });

  if (heading && heading.depth > 1) {
    return tree.children[0];
  }
  return;
};

// when we have a URL starting with '#',
// we need to recreate it, to send to the correct page
const recreateUrl = (pages, url, root) => {
  if (!url.startsWith('#')) return url;

  const slug = url.substring(1);

  return pages.reduce((acc, page, idx) => {
    const headingNode = findHeading(page, slug);

    if (headingNode) {
      const pageTitle = headingNode.children[0].value;
      const pageSlug = createSlug(pageTitle);

      let url = `${root}`;
      if (idx > 0) {
        url = `${url}/${pageSlug}`;
      }

      if (pageSlug !== slug) {
        url = `${url}#${slug}`;
      }

      return url;
    }

    return acc;
  }, '');
};

const relinkLinkReferences = (refs, definitions, pages, root) => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    ref.type = 'link';
    ref.url = recreateUrl(pages, definition.url, root);
    ref.children[0].value = `${ref.children[0].value} `; // a hack. if the name is the same as the URL, MD will not render it correctly
    delete ref.label;
    delete ref.identifier;
    delete ref.referenceType;
  });
};

const relinkImageReferences = (refs, definitions, pages, root) => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    ref.type = 'image';
    ref.url = definition.url;
    ref.alt = definition.alt;
    delete ref.label;
    delete ref.identifier;
    delete ref.referenceType;
  });
};

// because we are creating new pages, we need to link the references to the correct pages
const relinkReferences = (md, pages, root) => {
  const definitions = getTypes(md, 'definition');
  const linkReferences = getTypes(md, 'linkReference');
  const imageReferences = getTypes(md, 'imageReference');

  relinkLinkReferences(linkReferences, definitions, pages, root);
  relinkImageReferences(imageReferences, definitions, pages, root);
};

const importDocs = (filename, destination, parentTitle, options) => {
  const doc = fs.readFileSync(`./../../${filename}`, 'utf-8');

  const md = remark.parse(doc);

  const pages = divideIntoPages(md);
  relinkReferences(md, pages, `/docs/${destination}/`);

  pages.forEach((page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    const menuTitle = idx === 0 ? parentTitle : title;
    const order = idx === 0 ? options.RootOrder : idx;

    const doc = toMarkdown(page);

    createDir(`${DOCSROOT}${destination}`);

    fs.writeFileSync(
      `${DOCSROOT}${destination}/${slug}.mdx`,
      createFrontMatter(
        title,
        menuTitle,
        order,
        createEditOverwrite(filename, options),
      ) + doc,
      {
        flag: 'w',
      },
    );
  });
};

const importAll = (imports) => {
  imports.forEach((item) => {
    importDocs(item.file, item.destination, item.title, item.options);
  });
};

/**
 * Files to be imported
 */
const imports = [
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
    destination: 'build/tools/cryptography-utils',
    title: 'Cryptography-Utils',
    options: {
      RootOrder: 3,
    },
  },
  {
    file: 'libs/cryptography-utils/etc/cryptography-utils.api.md',
    destination: 'build/tools/cryptography-utils/api',
    title: 'Cryptography-Utils Api',
    options: {
      RootOrder: 98,
      hideEditLink: true,
    },
  },
  {
    file: 'libs/cryptography-utils/etc/crypto.api.md',
    destination: 'build/tools/cryptography-utils/crypto-api',
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
    destination: 'build/tools/kda-cli',
    title: 'KDA CLI',
    options: {
      RootOrder: 3,
    },
  },
  {
    file: 'tools/kda-cli/etc/kda-cli.api.md',
    destination: 'build/tools/kda-cli/api',
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

importAll(imports);
