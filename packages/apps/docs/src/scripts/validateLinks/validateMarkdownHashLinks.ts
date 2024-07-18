import chalk from 'chalk';
import { globby } from 'globby';
import markdownLinkExtractor from 'markdown-link-extractor';
import fs from 'node:fs';
import path from 'node:path';
import { getCleanedHash } from '../fixLocalLinks/utils/getCleanedHash';

// Function to validate anchor links within a single Markdown file
export interface IValidateAnchorLinksResult {
  file: string;
  invalidAnchors: string[];
  invalidInternalAnchors: string[];
}

function validateAnchorLinks(
  filePath: string,
  basePath: string,
): IValidateAnchorLinksResult {
  const content: string = fs.readFileSync(filePath, 'utf8');

  // Extract anchors
  const { anchors = [], links = [] }: { anchors: string[]; links: string[] } =
    markdownLinkExtractor(content, true) || {};

  const anchorLinks: string[] = links.filter((link: string) =>
    link.startsWith('#'),
  );

  const invalidAnchors: string[] = links.filter((link: string) => {
    if (link.startsWith('#')) return false;
    if (link.startsWith('http')) return false;
    if (link.startsWith('mailto')) return false;

    const match: RegExpMatchArray | null = link.match(/#(.*)$/);
    if (!match) return false;

    const cleanHashedUrl: string = getCleanedHash(link);
    const [linkPath, hash]: string[] = cleanHashedUrl.split('#');

    const internalLinkFilePath: string = path.join(basePath, `${linkPath}.md`);
    const internalLinkFileIndexPath: string = path.join(
      basePath,
      `${linkPath}/index.md`,
    );

    const internalContent: string | null = fs.existsSync(internalLinkFilePath)
      ? fs.readFileSync(internalLinkFilePath, 'utf8')
      : fs.existsSync(internalLinkFileIndexPath)
        ? fs.readFileSync(internalLinkFileIndexPath, 'utf8')
        : null;

    if (internalContent === null) {
      return true;
    }

    const { anchors = [] }: { anchors: string[] } =
      markdownLinkExtractor(internalContent, true) || {};

    return !anchors.includes(`#${hash}`);
  });

  const invalidInternalAnchors: string[] = anchorLinks.filter(
    (anchorLink: string) => !anchors.includes(getCleanedHash(anchorLink)),
  );

  return {
    file: filePath,
    invalidAnchors,
    invalidInternalAnchors,
  };
}

export default async function validateMarkdownHashLinks(
  basePath: string,
): Promise<IValidateAnchorLinksResult[]> {
  const pattern: string = `${basePath}/**/*.md`;

  const files: string[] = await globby(pattern);
  console.log(
    chalk.blue(
      `Scanning ${files.length} markdown files for internal/external title/hash links...`,
    ),
  );
  return files
    .map((file) => validateAnchorLinks(file, basePath))
    .filter(
      (result) =>
        result.invalidAnchors.length > 0 ||
        result.invalidInternalAnchors.length > 0,
    );
}
