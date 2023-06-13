import * as fs from 'fs';

const INITIALPATH = './src/pages/docs';
const INDEX = [];
const INDEXFILE = './src/data/searchIndex.json';

const createIndex = (rootDir, parent = []) => {
  const files = fs.readdirSync(rootDir);

  files.forEach((file) => {
    const currentFile = `${rootDir}/${file}`;

    // parent = pushToParent(parent, child);

    if (fs.statSync(currentFile).isDirectory()) {
      return createIndex(currentFile, parent);
    } else {
      parent.push(currentFile);
    }
  });

  return parent;
};

const result = createIndex(INITIALPATH, INDEX);
console.log(result);
//fs.writeFileSync(INDEXFILE, result);
