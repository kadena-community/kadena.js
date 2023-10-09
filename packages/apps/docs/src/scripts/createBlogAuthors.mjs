import fs from 'fs';
import { globby } from 'globby';
import path from 'path';
import authors from './../data/authors.json' assert { type: 'json' };

const ROOT = `${path.resolve()}/src/pages/blogchain`;
const errorFiles = [];

const getFrontmatterAuthor = (file) => {
  const regExp = /author:\s*(.+)/;
  return file.match(regExp);
};

const addAuthorIdToFrontmatter = (file, author) => {
  const regExp = /(author:\s*.+)/;
  return file.replace(regExp, `$1\nauthorId: ${author.id}`);
};

const getFrontmatterAuthorId = (file) => {
  const regExp = /authorId:\s*(.+)/;
  return file.match(regExp);
};

const getAuthorId = (name) => {
  if (!name) return;
  return authors.find((author) => author.name === name);
};

const checkAuthors = async () => {
  const paths = await globby([`${ROOT}/**/*.md`]);

  paths.forEach((item) => {
    const file = fs.readFileSync(item, 'utf8');

    const match = getFrontmatterAuthor(file);

    const author = getAuthorId(match[1]);
    if (author && !getFrontmatterAuthorId(file)) {
      const newFile = addAuthorIdToFrontmatter(file, author);

      fs.writeFileSync(item, newFile);
    } else if (!author) {
      errorFiles.push(item);
    }
  });

  if (errorFiles.length > 0) {
    errorFiles.forEach((item) => {
      console.log(`no authorInfo: ${item}`);
    });
    throw new Error(
      `there were ${errorFiles.length} blogposts without author info`,
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
console.log('Check blog for existing authors');
checkAuthors();
