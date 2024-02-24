import fs from 'fs';
import { glob } from 'glob';
import markdownLinkExtractor from 'markdown-link-extractor';
import path from 'path';

const basePath = './src/pages'; // Adjust this to your Markdown files' base path

async function main() {
  const files = await glob(`${basePath}/**/*.md`);
  files.forEach((file) => {
    const markdown = fs.readFileSync(file, 'utf8');
    const { links = [] } = markdownLinkExtractor(markdown, true) || {};

    const brokenLinks = [...links].filter((link) => {
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
    });

    if (brokenLinks.length > 0) {
      console.log(`Broken links found in ${file}:`);
      brokenLinks.forEach((link) => console.log(`- ${link}`));
    }
  });
}

await main().catch(console.error);
