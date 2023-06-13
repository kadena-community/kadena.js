import * as fs from 'fs';

const INITIALPATH = './src/pages/docs';
const INDEX = [];
const INDEXFILE = './src/data/searchIndex.json';

const result = createIndex(INITIALPATH, INDEX);

fs.writeFileSync(INDEXFILE, result);
