import * as fs from 'fs';
import yaml from 'js-yaml';
import { frontmatter } from 'micromark-extension-frontmatter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import MiniSearch from 'minisearch';

const INITIALPATH = './src/pages/docs';
const INDEX = [];
const INDEXFILE = './src/data/searchIndex.json';

const isMarkDownFile = (name) => {
  const extension = name.split('.').at(-1);
  return extension.toLowerCase() === 'md' || extension.toLowerCase() === 'mdx';
};

const getFrontMatter = (doc) => {
  const tree = fromMarkdown(doc.toString(), {
    extensions: [frontmatter()],
    mdastExtensions: [frontmatterFromMarkdown()],
  });

  return yaml.load(tree.children[0].value);
};

const convertFile = (file) => {
  const doc = fs.readFileSync(`${file}`, 'utf-8');
  const data = getFrontMatter(doc);

  return {
    id: file,
    title: data.title,
    description: data.description,
    filename: file,
    content: doc,
  };
};

const createIndex = (rootDir, parent = []) => {
  const files = fs.readdirSync(rootDir);

  files.forEach((file) => {
    const currentFile = `${rootDir}/${file}`;

    // parent = pushToParent(parent, child);

    if (fs.statSync(currentFile).isDirectory()) {
      return createIndex(currentFile, parent);
    } else {
      if (isMarkDownFile(currentFile)) {
        const data = convertFile(currentFile);
        parent.push(data);
      }
    }
  });

  return parent;
};

const result = createIndex(INITIALPATH, INDEX);
const fileStr = JSON.stringify(result, null, 2);

const miniSearch = new MiniSearch({
  fields: ['title', 'description', 'content'],
  storeFields: ['title', 'filename', 'description'],
  boost: {
    title: 2,
  },
  fuzzy: 0.2,
});

await miniSearch.addAllAsync(result);

fs.writeFileSync(INDEXFILE, JSON.stringify(miniSearch.toJSON()));
