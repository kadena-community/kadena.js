import chalk from 'chalk';
import { globby } from 'globby';
import markdownLinkExtractor from 'markdown-link-extractor';
import fs from 'node:fs';
import path from 'node:path';

export interface IValidateMarkdownLinksResult {
  file: string;
  brokenLinks: string[];
}

export default async function validateMarkdownLinks(
  basePath: string,
): Promise<IValidateMarkdownLinksResult[]> {
  const files = await globby(`${basePath}/**/*.md`);
  console.log(
    chalk.blue(`Scanning ${files.length} markdown files for links...`),
  );
  return files
    .map((file: string) => {
      const markdown = fs.readFileSync(file, 'utf8');
      const { links = [] } = markdownLinkExtractor(markdown, true) || {};

      const brokenLinks = [...links].filter((link: string) => {
        // Strip out everything from the hash fragment onwards
        const cleanedLink = link.replace(/#.*/, '');
        // Filter out external links
        if (cleanedLink.startsWith('http')) return false;
        if (cleanedLink.startsWith('mailto')) return false;
        if (cleanedLink.startsWith('https')) return false;

        // Ignore assets
        if (cleanedLink.startsWith('/assets')) return false;
        // Ignore tags
        if (cleanedLink.startsWith('/tags')) return false;

        const expectedPath = path.join(basePath, `${cleanedLink}.tsx`);
        const expectedTSIndexPath = path.join(
          basePath,
          `${cleanedLink}/index.tsx`,
        );
        const expectedMdPath = path.join(basePath, `${cleanedLink}.md`);
        const expectedMdIndexPath = path.join(
          basePath,
          `${cleanedLink}/index.md`,
        );

        const blogPageLink = path.join(path.dirname(file), `${cleanedLink}.md`);

        return (
          !fs.existsSync(expectedPath) &&
          !fs.existsSync(expectedTSIndexPath) &&
          !fs.existsSync(expectedMdPath) &&
          !fs.existsSync(expectedMdIndexPath) &&
          !fs.existsSync(blogPageLink)
        );
      }) as string[];

      if (brokenLinks.length > 0) {
        return {
          file,
          brokenLinks,
        };
      }

      return;
    })
    .filter(
      (result): result is IValidateMarkdownLinksResult => result !== undefined,
    );
}
