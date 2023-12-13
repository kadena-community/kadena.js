import type { IAuthorInfo } from '@kadena/docs-tools';
import fs from 'fs';
import { globby } from 'globby';
import path from 'path';
import authors from '../data/authors.json';

const errors: string[] = [];
const success: string[] = [];

const ROOT = `${path.resolve()}/src/pages/blogchain`;
const errorFiles: string[] = [];

const getFrontmatterAuthor = (file: string): RegExpMatchArray | undefined => {
  const regExp: RegExp = /author:\s*(.+)/;
  return file.match(regExp) ?? undefined;
};

const addAuthorIdToFrontmatter = (
  file: string,
  author: IAuthorInfo,
): string => {
  const regExp = /(author:\s*.+)/;
  return file.replace(regExp, `$1\nauthorId: ${author.id}`);
};

const getFrontmatterAuthorId = (file: string): RegExpMatchArray | undefined => {
  const regExp: RegExp = /authorId:\s*(.+)/;
  return file.match(regExp) ?? undefined;
};

const getAuthorId = (name: string): IAuthorInfo | undefined => {
  if (!name) return;
  return authors.find((author) => author.name === name);
};

interface ICheckAuthorsResult {
  errors: string[];
  success: string[];
}

export const checkAuthors = async (): Promise<ICheckAuthorsResult> => {
  const paths = await globby([`${ROOT}/**/*.md`]);

  paths.forEach((item) => {
    const file = fs.readFileSync(item, 'utf8');

    const match = getFrontmatterAuthor(file) || [];

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
      `there were ${errorFiles.length} blog posts without author info`,
    );
  } else {
    success.push('There were no issues found with author info in the blogs');
  }

  return { errors, success };
};
