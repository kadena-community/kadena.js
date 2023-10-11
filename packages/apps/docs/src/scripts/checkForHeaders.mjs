import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const errors = [];
const success = [];

/**
 * This script will check that all MD or MDX files
 * that they have an H1 tag.
 */

const filesMissingHeaders = [];

const ROOT = `${path.resolve()}/src/pages`;
const headerDepth1Regex = /^#\s+(.*?)\s*$/gm;

//we dont want to have the headers that are inside a code block
// because these are actually comments
const removeCodeBlocks = (content) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  return content.replace(codeBlockRegex, '');
};

export const checkForHeaders = async () => {
  const paths = await globby([`${ROOT}/**/*.md`]);

  paths.forEach((item) => {
    const file = fs.readFileSync(item, 'utf8');

    const cleanContent = removeCodeBlocks(file);

    const matches = [...cleanContent.matchAll(headerDepth1Regex)];

    if (matches.length > 1 || !matches.length) {
      filesMissingHeaders.push(`${item} has ${matches.length} headers`);
    }
  });

  if (filesMissingHeaders.length) {
    errors.push('Found files with missing headers');
    filesMissingHeaders.map((item) => {
      errors.push(`Missing h1 header in file: ${item}`);
    });

    errors.push(`Found files: (${filesMissingHeaders.length})`);
  } else {
    success.push('No missing H1 headers');
  }

  return { errors, success };
};
