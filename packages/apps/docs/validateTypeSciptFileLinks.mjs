import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

async function extractLinksFromComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Regex to capture the full <Link> component
  const linkComponentRegex = /<Link[^>]+href=["']([^"']+)["'][^>]*>/g;
  let match;
  const links = [];

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

async function verifyLinksExist(links, basePath) {
  const brokenLinks = [];

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

async function main() {
  const basePath = path.resolve('./src/pages');
  const tsxFiles = await glob('./src/pages/**/*.+(tsx|ts)');

  console.log(`Scanning ${tsxFiles.length} files for internal links...`);

  for (const file of tsxFiles) {
    const internalLinks = await extractLinksFromComponent(file);
    const brokenLinks = await verifyLinksExist(internalLinks, basePath);

    if (brokenLinks.length > 0) {
      console.log(`Broken links found in ${file}:`, brokenLinks);
    }
  }
}

await main().catch(console.error);
