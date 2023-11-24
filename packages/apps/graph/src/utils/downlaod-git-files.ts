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
) {}

export async function getDownloadUrl(
  owner: string,
  name: string,
  path: string,
  branch: string,
) {
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

  return data;
}
