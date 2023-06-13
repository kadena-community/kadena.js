import * as fs from 'fs';

const INITIALPATH = './src/pages/docs';
const INDEX = [];
const INDEXFILE = './src/data/searchIndex.json';

const createIndex = (rootDir, parent = []) => {
  const files = fs.readdirSync(rootDir);

  files.forEach((file) => {
    const currentFile = `${rootDir}/${file}`;

    const arr = [];
    let child = {
      children: arr,
    };

    console.log(currentFile);

    // parent = pushToParent(parent, child);

    // if (fs.statSync(currentFile).isDirectory()) {
    //   child.children = createTree(currentFile, child.children);

    //   return child.children;
    // }
  });

  return parent;
};

const result = createIndex(INITIALPATH, INDEX);

fs.writeFileSync(INDEXFILE, result);
