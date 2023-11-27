import { fstat, writeFile, writeFileSync } from 'fs';
import https from 'https';

export async function downloadGitFiles(
  {
    owner,
    name,
    path,
    branch,
  }: {
    owner: string;
    name: string;
    path: string;
    branch: string;
  },
  destinationPath: string,
): Promise<void> {
  const downloadUrl = await getDownloadUrl(owner, name, path, branch);

  const options = {
    headers: {
      'User-Agent': 'node.js',
    },
  };

  //get downloadUrl using https library
  const data = await new Promise((resolve, reject) => {
    https.get(downloadUrl, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });

  // Save the downloaded file on destinationPath
  writeFileSync(destinationPath, data as string);
}

export async function getDownloadUrl(
  owner: string,
  name: string,
  path: string,
  branch: string,
): Promise<URL> {
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${branch}`;

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
      res.on('end', () => resolve(JSON.parse(data).download_url));
      res.on('error', reject);
    });
  });

  return data as URL;
}
