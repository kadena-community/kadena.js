const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');


function extractBrokenLinksFromMdFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while (match = linkRegex.exec(fileContent)) {
        links.push(match[2]);
    }

    const brokenLinks = [];
    const directory = path.dirname(filePath);
    links.forEach((link, index) => {
        // clean the link of hash fragments
        link = link.split('#')[0];
        if (link.length === 0){
            return
        }
        // ignore external links, for now
        if (link.startsWith('http')) {
            return;
        }

        if (link.startsWith('/assets')) {
            links[index] = path.join('../public/', link)
        } else {
            links[index] = path.join(directory, link);
        }

        if (!fs.existsSync(links[index])) {
            brokenLinks.push(links[index]);
        }
    });

    return brokenLinks;
}

const filesWithBrokenLinks = {}

function processFiles(directory) {
  const files = fs.readdirSync(directory);
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      processFiles(filePath); // Recursively process subdirectories
    } else {
      const fileExtension = path.extname(filePath);

      if (fileExtension === '.md' || fileExtension === '.mdx') {
        const brokenLinks = extractBrokenLinksFromMdFile(filePath);
        if (brokenLinks.length > 0){
            filesWithBrokenLinks[filePath] = brokenLinks;
        }
      }
    }
  });
}

const main = () => {
    const directoryPath = path.join(__dirname, '../src');
    processFiles(directoryPath);
    console.log(filesWithBrokenLinks)
}

main()