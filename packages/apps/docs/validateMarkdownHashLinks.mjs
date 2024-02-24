import fs from 'fs';
import { glob } from 'glob';
import markdownLinkExtractor from 'markdown-link-extractor';
import path from 'path';

// Function to validate anchor links within a single Markdown file
function validateAnchorLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract anchors
  const { anchors = [], links = [] } =
    markdownLinkExtractor(content, true) || {};

  const anchorLinks = links.filter((link) => link.startsWith('#'));

  const invalidAnchors = links.filter((link) => {
    if (link.startsWith('#')) return false;
    if (link.startsWith('http')) return false;
    if (link.startsWith('mailto')) return false;

    const match = link.match(/#(.*)$/);
    if (!match) return false;

    const cleanHashedUrl = link.replace(/(h\d+|h-\d+)/g, '');
    const [linkPath, hash] = cleanHashedUrl.split('#');

    const internalLinkFilePath = path.join(basePath, `${linkPath}.md`);
    const internalLinkFileIndexPath = path.join(
      basePath,
      `${linkPath}/index.md`,
    );

    const internalContent = fs.existsSync(internalLinkFilePath)
      ? fs.readFileSync(internalLinkFilePath, 'utf8')
      : fs.existsSync(internalLinkFileIndexPath)
      ? fs.readFileSync(internalLinkFileIndexPath, 'utf8')
      : null;

    if (internalContent === null) {
      return true;
    }

    const { anchors = [] } = markdownLinkExtractor(internalContent, true) || {};

    return !anchors.includes(`#${hash}`);
  });

  const invalidInternalAnchors = anchorLinks.filter(
    (anchorLink) => !anchors.includes(anchorLink),
  );

  if (invalidInternalAnchors.length > 0) {
    console.log(`Invalid internal anchor links found in ${filePath}:`);
    invalidInternalAnchors.forEach((anchor) => console.log(`- ${anchor}`));
  }

  if (invalidAnchors.length > 0) {
    console.log(`Invalid anchor links found in ${filePath}:`);
    invalidAnchors.forEach((anchor) => console.log(`- ${anchor}`));
  }
}

const basePath = './src/pages';
async function main() {
  const pattern = `${basePath}/**/*.md`;

  const files = await glob(pattern);

  files.forEach(validateAnchorLinks);
}

await main().catch((err) => console.error(err));
