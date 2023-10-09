import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

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

function getDisallowedLinksFromMdFile(links) {
  const blackListedUrls = [
    'medium.com/kadena-io',
    //'pact-language.readthedocs.io',  todo when pact docs are approved
    'docs.kadena.io',
    //'api.chainweb.com', todo when pact docs are approved
    // 'kadena-io.github.io' ,todo when pact docs are approved
  ];
  return links.reduce((acc, val) => {
    const found = blackListedUrls.filter((url) => val.includes(url));

    if (found.length) {
      return [...acc, `${val} (BLACKLISTED)`];
    }

    return acc;
  }, []);
}

function extractBrokenLinksFromMdFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(fileContent))) {
    links.push(match[2]);
  }

  return [
    ...getBrokenLinks(filePath, links),
    ...getDisallowedLinksFromMdFile(links),
  ];
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
  console.log(
    '=============================== START CHECKING FOR DEADLINKS ==\n\n',
  );

  const directoryPath = path.join(__dirname, 'src/pages');
  processFiles(directoryPath);

  if (Object.keys(filesWithBrokenLinks).length > 0) {
    Object.keys(filesWithBrokenLinks).forEach((key) => {
      filesWithBrokenLinks[key].forEach((link) => {
        console.warn(
          chalk.red('⨯'),
          'file',
          chalk.red(key),
          ': link',
          chalk.red(link),
        );
      });
    });

    console.log('');
    console.log('');
    console.warn(
      chalk.red('⨯'),
      `${countDeadLinks(filesWithBrokenLinks)} issues found`,
    );
  } else {
    console.log(chalk.green('✓'), 'NO BROKENLINKS FOUND!');
  }

  console.log(
    '\n\n=============================== END CHECKING FOR DEADLINKS ====',
  );
};

main();
