import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const externalLinks = {};

function getBrokenLinks(filePath, links) {
  const brokenLinks = [];
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

function extractBrokenLinksFromTsFile(filePath) {
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
function extractBrokenLinksFromMdFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(fileContent))) {
    links.push(match[2]);
  }

  const brokenLinks = getBrokenLinks(filePath, links);

  return brokenLinks;
}

const filesWithBrokenLinks = {};

function processFiles(directory) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      processFiles(filePath); // Recursively process subdirectories
    } else {
      const fileExtension = path.extname(filePath);
      const localFilePath = filePath.replace(__dirname, '');

      if (fileExtension === '.md') {
        const brokenLinks = extractBrokenLinksFromMdFile(filePath);
        if (brokenLinks.length > 0) {
          filesWithBrokenLinks[localFilePath] = brokenLinks;
        }
      }

      if (fileExtension === '.tsx') {
        const brokenLinks = extractBrokenLinksFromTsFile(filePath);
        if (brokenLinks.length > 0) {
          filesWithBrokenLinks[localFilePath] = brokenLinks;
        }
      }
    }
  });
}

const countDeadLinks = (filesWithBrokenLinks) => {
  return Object.keys(filesWithBrokenLinks).reduce((acc, val) => {
    return acc + filesWithBrokenLinks[val].length;
  }, 0);
};

const main = async () => {
  const directoryPath = path.join(__dirname, 'src');
  processFiles(directoryPath);

  if (Object.keys(filesWithBrokenLinks).length > 0) {
    throw new Error(
      `Found broken links : ${JSON.stringify(filesWithBrokenLinks, null, 2)} \n
      Found deadlinks: (${countDeadLinks(filesWithBrokenLinks)})`,
    );
  } else {
    console.log('No BrokenLinks Found!');
  }
};

main();
