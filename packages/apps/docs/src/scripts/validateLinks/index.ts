import chalk from 'chalk';
import type { IValidateAnchorLinksResult } from './validateMarkdownHashLinks';
import validateMarkdownHashLinks from './validateMarkdownHashLinks';
import type { IValidateMarkdownLinksResult } from './validateMarkdownLinks';
import validateMarkdownLinks from './validateMarkdownLinks';
import type { IValidateTypeScriptFileLinksResult } from './validateTypeScriptFileLinks';
import validateTypeScriptFileLinks from './validateTypeScriptFileLinks';

const args = process.argv.slice(2);
const isCi = args.includes('--ci');
let ERRORCOUNT = 0;

// This is to avoid false positives for links that are not broken within the docs
// but are broken in the website E.g. might comes from the different docs repo
// it could be fixed in the following PR later on
// to avoid the hard dependency on the doc website repo

// since we already have the redirect in place for the /learn-pact/beginner/welcome-to-pact it's ignored
const ignoreLinks = ['/learn-pact/beginner/welcome-to-pact'];

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
        ERRORCOUNT++;
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
        ERRORCOUNT++;
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
          ERRORCOUNT++;
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

  // Only to filter out the links that are not in the ignore list
  // and have broken links
  // This is to avoid false positives(or avoid immediate dependency) for links that are not broken within the docs
  const filteredLinks = [...markdownLinks, ...typeScriptLinks].filter(
    (result) => {
      const brokenLinks = result.brokenLinks.filter(
        (link) => !ignoreLinks.includes(link),
      );
      return brokenLinks.length > 0;
    },
  );

  if (isCi) {
    if (filteredLinks.length > 0 || markdownHashLinks.length > 0) {
      process.exit(1);
    }
  }
}

const basePath: string = './src/pages';

await validateLinks(basePath);
console.log('ERRORCOUNT', ERRORCOUNT);
