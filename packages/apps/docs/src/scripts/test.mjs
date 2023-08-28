import fs from 'fs';
import path from 'path';
import { remark } from 'remark';

/**
 * script needed to rename all MDX files to MD
 */

const DOCSROOT = './src/pages/docs/';

const getMDTypes = (md, filename) => {
  if (md.type === 'mdxJsxFlowElement') {
    console.log(md.type, filename);
  }
  if (md.children) {
    md.children.forEach((item) => {
      getMDTypes(item, filename);
    });
  }
};

const checkMDTypes = (root) => {
  const list = fs.readdirSync(root);

  list.forEach((item) => {
    const innerDirName = `${root}/${item}`;

    if (path.extname(item) === '.mdx') {
      console.log(`${innerDirName} is a MDX`);
    }

    if (path.extname(item) === '.md') {
      const doc = fs.readFileSync(innerDirName, 'utf-8');

      const md = remark.parse(doc);

      getMDTypes(md, innerDirName);
    }

    const file = fs.lstatSync(innerDirName);
    if (file.isDirectory()) {
      return checkMDTypes(innerDirName);
    }
  });
};

checkMDTypes(DOCSROOT);
