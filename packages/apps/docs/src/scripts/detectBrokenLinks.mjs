import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
const __dirname = path.resolve();

const externalLinks = {}

function getBrokenLinks(filePath, links) {
  const brokenLinks = [];
  const directory = path.dirname(filePath);
  links.forEach((link, index) => {
    // clean the link of hash fragments
    link = link.split('#')[0];
    if (link.length === 0) {
      return
    }
    if (link.startsWith('http')) {
      if (!externalLinks[filePath]) {
        externalLinks[filePath] = []
      }

      externalLinks[filePath].push(link)
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

  return brokenLinks
}

function extractBrokenLinksFromTsFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /<a href="([^"]+)">/g;
  const links = [];
  let match;

  while (match = linkRegex.exec(fileContent)) {
    links.push(match[1]);
  }

  const broken = getBrokenLinks(filePath, links)
  return broken
}
function extractBrokenLinksFromMdFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while (match = linkRegex.exec(fileContent)) {
    links.push(match[2]);
  }

  const brokenLinks = getBrokenLinks(filePath, links)

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
        if (brokenLinks.length > 0) {
          filesWithBrokenLinks[filePath] = brokenLinks;
        }
      }

      if (fileExtension === '.tsx') {
        const brokenLinks = extractBrokenLinksFromTsFile(filePath);
        if (brokenLinks.length > 0) {
          filesWithBrokenLinks[filePath] = brokenLinks;
        }
      }
    }
  });
}

async function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function checkExternalLink(link) {
  await wait(500)
  return new Promise((resolve, reject) => {
    // establish a timeout to fail
    setTimeout(() => {
      resolve(false)
    }, 5000)

    const method = link.startsWith('https') ? https.get : http.get
    method(link, res => {
      console.log('checking external link', link)
      if (res.statusCode !== 200) {
        resolve(false)
      }
      resolve(true)
    }).on('error', e => {
      resolve(false)
    })
  })
}

async function processExternalLinks(externalLinks) {
  for (const filePath in externalLinks) {
    const links = externalLinks[filePath]
    for (const link of links) {
      const isValid = await checkExternalLink(link)
      if (!isValid) {
        if (!filesWithBrokenLinks[filePath]) {
          filesWithBrokenLinks[filePath] = []
        }
        filesWithBrokenLinks[filePath].push(link)
      }
    }
  }

  console.log('finished processing external links')
}

const main = async ({ includeExternalLinks, reportMd}) => {
  const directoryPath = path.join(__dirname, 'src');
  processFiles(directoryPath);

  if (includeExternalLinks) {
    await processExternalLinks(externalLinks)
  }
  
  if (reportMd) {
    const reportMd = ['# Broken links']
    for (const filePath in filesWithBrokenLinks) {
      const links = filesWithBrokenLinks[filePath]
      reportMd.push(`## ${filePath}`)
      for (const link of links) {
        reportMd.push(`- ${link}`)
      }
    }

    fs.writeFileSync(path.join(__dirname, 'broken-links.md'), reportMd.join('\n'))
    console.log('Wrote broken links report to broken-links.md')
  }  
  
  if (Object.keys(filesWithBrokenLinks).length > 0) {
    throw new Error('Found broken links:' + JSON.stringify(filesWithBrokenLinks, null, 2))
  }

}

const args = process.argv.slice(2);

if (args.length === 0) {
  main({ includeExternalLinks: false, reportMd: false })
} else {
  const includeExternalLinks = args.includes('--include-external-links')
  const reportMd = args.includes('--report-md')

  main({ includeExternalLinks, reportMd })
}

