import { getFileExtension } from '@kadena/docs-tools';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import type { IScriptResult } from './types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.resolve();
const errors: string[] = [];
const success: string[] = [];

type LinksType = Record<string, string[]>;

const externalLinks: LinksType = {};

function getBrokenLinks(filePath: string, links: string[]): string[] {
  const brokenLinks: string[] = [];
  //const directory = path.dirname(filePath);
  links.forEach((link, index) => {
    // clean the link of hash fragments
    link = link.split('#')[0];
    if (link.length === 0) {
      return;
    }
    if (link.startsWith('http')) {
      if (!externalLinks[filePath]) {
        externalLinks[filePath] = [];
      }

      externalLinks[filePath].push(link);
      return;
    }

    if (link.startsWith('/assets')) {
      links[index] = path.join('public/', link);
    } else {
      links[index] = path.join(__dirname, 'src/pages', link);
    }

    // places where the link could live
    const fileMD = `${links[index]}.md`;
    const fileTSX = `${links[index]}.tsx`;
    const fileIndex = `${links[index]
      .split('/')
      .slice(0, links[index].split('/').length - 1)
      .join('/')}/index`;
    const fileIndexMD = `${fileIndex}.md`;
    const fileIndexTSX = `${fileIndex}.tsx`;

    if (
      !fs.existsSync(links[index]) &&
      !fs.existsSync(fileMD) &&
      !fs.existsSync(fileTSX) &&
      !fs.existsSync(fileIndexMD) &&
      !fs.existsSync(fileIndexTSX)
    ) {
      // remove __dirname from links[index]
      links[index] = links[index].replace(__dirname, '');
      brokenLinks.push(links[index]);
    }
  });

  return brokenLinks;
}

function extractBrokenLinksFromTsFile(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /<a href="([^"]+)">/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(fileContent))) {
    links.push(match[1]);
  }

  const broken = getBrokenLinks(filePath, links);
  return broken;
}

const filesWithBrokenLinks: LinksType = {};

function processFiles(directory: string): void {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      processFiles(filePath); // Recursively process subdirectories
    } else {
      const fileExtension = getFileExtension(filePath);
      const localFilePath = filePath.replace(__dirname, '');

      if (fileExtension === 'tsx') {
        const brokenLinks = extractBrokenLinksFromTsFile(filePath);

        if (brokenLinks.length > 0) {
          filesWithBrokenLinks[localFilePath] = brokenLinks;
        }
      }
    }
  });
}

const countDeadLinks = (filesWithBrokenLinks: LinksType): number => {
  return Object.keys(filesWithBrokenLinks).reduce(
    (acc: number, val: string) => {
      return acc + filesWithBrokenLinks[val].length;
    },
    0,
  );
};

export const detectBrokenLinks = async (): Promise<IScriptResult> => {
  const directoryPath = path.join(__dirname, 'src/pages');
  processFiles(directoryPath);

  if (Object.keys(filesWithBrokenLinks).length > 0) {
    Object.keys(filesWithBrokenLinks).forEach((key) => {
      filesWithBrokenLinks[key].forEach((link) => {
        errors.push(
          `brokenlink detected in ${chalk.red(key)} (link: ${chalk.red(link)})`,
        );
      });
    });

    errors.push(`${countDeadLinks(filesWithBrokenLinks)} issues found`);
  } else {
    success.push('No brokenlinks found!');
  }

  return { success, errors };
};
