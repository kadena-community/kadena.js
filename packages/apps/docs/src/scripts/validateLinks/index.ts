import chalk from 'chalk';
import type { IValidateAnchorLinksResult } from './validateMarkdownHashLinks';
import validateMarkdownHashLinks from './validateMarkdownHashLinks';
import type { IValidateMarkdownLinksResult } from './validateMarkdownLinks';
import validateMarkdownLinks from './validateMarkdownLinks';
import type { IValidateTypeScriptFileLinksResult } from './validateTypeScriptFileLinks';
import validateTypeScriptFileLinks from './validateTypeScriptFileLinks';

const args = process.argv.slice(2);
const isCi = args.includes('--ci');

export default async function validateLinks(basePath: string): Promise<void> {
  const [markdownLinks, typeScriptLinks, markdownHashLinks] =
    (await Promise.all([
      validateMarkdownLinks(basePath),
      validateTypeScriptFileLinks(basePath),
      validateMarkdownHashLinks(basePath),
    ]).catch((error) => {
      console.error(error);
    })) as [
      IValidateMarkdownLinksResult[],
      IValidateTypeScriptFileLinksResult[],
      IValidateAnchorLinksResult[],
    ];

  if (markdownLinks.length > 0) {
    console.log(chalk.red('\n====== Broken markdown links ======'));
    markdownLinks.forEach((result) => {
      console.log(chalk.blue(`File: ${result.file}`));
      result.brokenLinks.forEach((link) => {
        console.log(chalk.red(`    - ${link}`));
      });
    });
  } else {
    console.log(chalk.green('No broken Markdown links found.'));
  }

  if (typeScriptLinks.length > 0) {
    console.log(chalk.red('\n====== Broken TypeScript links ======'));
    typeScriptLinks.forEach((result) => {
      console.log(chalk.blue(`File: ${result.file}`));
      result.brokenLinks.forEach((link) => {
        console.log(chalk.red(`    - ${link}`));
      });
    });
  } else {
    console.log(chalk.green('No broken TypeScript links found.'));
  }

  if (markdownHashLinks.length > 0) {
    console.log(chalk.red('\n====== Broken Markdown hash links ======'));
    markdownHashLinks.forEach((result) => {
      console.log(chalk.blue(`File: ${result.file}`));
      if (result.invalidAnchors.length > 0) {
        result.invalidAnchors.forEach((link) => {
          console.log(chalk.red(`    - ${link}`));
        });
      }
      if (result.invalidInternalAnchors.length > 0) {
        result.invalidInternalAnchors.forEach((link) => {
          console.log(chalk.red(`    - ${link}`));
        });
      }
    });
  } else {
    console.log(chalk.green('No broken Markdown hash links found.'));
  }

  if (isCi) {
    if (
      markdownLinks.length > 0 ||
      typeScriptLinks.length > 0 ||
      markdownHashLinks.length > 0
    ) {
      process.exit(1);
    }
  }
}

const basePath: string = './src/pages';

await validateLinks(basePath);
