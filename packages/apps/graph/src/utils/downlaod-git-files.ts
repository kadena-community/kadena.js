import { fstat, writeFile, writeFileSync } from 'fs';
import https from 'https';

export async function downloadGitFilesFromFolder(
  {
    owner,
    name,
    folderPath,
    branch,
  }: {
    owner: string;
    name: string;
    folderPath: string;
    branch: string;
  },
  destinationPath: string = process.cwd(),
  fileExtension: string = 'yaml',
): Promise<void> {
  const folderUrl = buildGitApiUrl(owner, name, folderPath, branch);

  const gitData = await getGitData(folderUrl);

  if (gitData instanceof Array) {
    for (const file of gitData) {
      if (
        !file.name.endsWith(fileExtension) ||
        file.type !== 'file' ||
        !file.download_url
      ) {
        continue;
      }
      const rawFileUrl = file.download_url;
      const content = await new Promise((resolve, reject) => {
        https.get(rawFileUrl, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
          res.on('error', reject);
        });
      });
      console.log(destinationPath);
      writeFileSync(`${destinationPath}/${file.name}`, content as string);
    }
  } else {
    throw new Error('Provided path is not a valid folder');
  }
}

export async function getGitData(url: string): Promise<any> {
  const options = {
    headers: {
      'User-Agent': 'node.js',
    },
  };

  //get downloadUrl using https library
  const data = await new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
  });

  return data;
}

function buildGitApiUrl(
  owner: string,
  name: string,
  path: string,
  branch: string,
) {
  return `https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${branch}`;
}
