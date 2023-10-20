import fs from 'fs';
import { globby } from 'globby';
import path from 'path';
import authors from './../src/data/authors.json' assert { type: 'json' };
import { BuildReturn, ErrorsReturn, SucccessReturn } from './types.mjs';

const errors: ErrorsReturn = [];
const success: SucccessReturn = [];

const ROOT = `${path.resolve()}/src/pages/blogchain`;
const errorFiles: string[] = [];

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

export const checkAuthors = async (): Promise<BuildReturn> => {
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
      errors.push(`no authorInfo for file: ${item}`);
    });
    errors.push(
      `there were ${errorFiles.length} blogposts without author info`,
    );
  } else {
    success.push('There were no issues found with author info in the blogs');
  }

  return { errors, success };
};
