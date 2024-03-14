import chalk from 'chalk';
import fs from 'fs';
import { globby } from 'globby';
import path from 'path';

async function extractLinksFromComponent(filePath: string): Promise<string[]> {
  const content = fs.readFileSync(filePath, 'utf8');
  // Regex to capture the full <Link> component
  const linkComponentRegex = /<Link[^>]+href=["']([^"']+)["'][^>]*>/g;
  let match;
  const links: string[] = [];

  while ((match = linkComponentRegex.exec(content)) !== null) {
    // Extract href value
    const href = match[1];
    if (href.startsWith('/')) {
      // Consider only internal links
      links.push(href);
    }
  }

  return links;
}

async function verifyLinksExist(
  links: string[],
  basePath: string,
): Promise<string[]> {
  const brokenLinks: string[] = [];

  for (const link of links) {
    const expectedPath = path.join(basePath, `${link}.tsx`);
    const expectedTSIndexPath = path.join(basePath, `${link}/index.tsx`);
    const expectedMdPath = path.join(basePath, `${link}.md`);
    const expectedMdIndexPath = path.join(basePath, `${link}/index.md`);
    if (
      !fs.existsSync(expectedPath) &&
      !fs.existsSync(expectedTSIndexPath) &&
      !fs.existsSync(expectedMdPath) &&
      !fs.existsSync(expectedMdIndexPath)
    ) {
      brokenLinks.push(link);
    }
  }

  return brokenLinks;
}

export interface IValidateTypeScriptFileLinksResult {
  file: string;
  brokenLinks: string[];
}

export default async function validateTypeScriptFileLinks(
  basePath: string,
): Promise<IValidateTypeScriptFileLinksResult[]> {
  const tsxFiles = await globby(`${basePath}/**/*.+(tsx|ts)`);

  console.log(
    chalk.blue(
      `Scanning ${tsxFiles.length} typesript files for internal links...`,
    ),
  );

  const overallBrokenLinks: IValidateTypeScriptFileLinksResult[] = [];
  for (const file of tsxFiles) {
    const internalLinks = await extractLinksFromComponent(file);
    const brokenLinks = await verifyLinksExist(internalLinks, basePath);

    if (brokenLinks.length > 0) {
      overallBrokenLinks.push({
        file,
        brokenLinks,
      });
    }
  }

  return overallBrokenLinks;
}
