import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

/**
 * This script will check that all MD or MDX files
 * that they have an H1 tag.
 */

const filesMissingHeaders = [];

const ROOT = `${path.resolve()}/src/pages/docs`;
const headerDepth1Regex = /^#\s+(.*?)\s*$/gm;

//we dont want to have the headers that are inside a code block
// because these are actually comments
const removeCodeBlocks = (content) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  return content.replace(codeBlockRegex, '');
};

const checkForHeaders = async () => {
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
    throw new Error(
      `Found files with missing headers : ${JSON.stringify(
        filesMissingHeaders,
        null,
        2,
      )} \n
      Found files: (${filesMissingHeaders.length})`,
    );
  } else {
    console.log('No missing H1 headers');
  }
};

checkForHeaders();
