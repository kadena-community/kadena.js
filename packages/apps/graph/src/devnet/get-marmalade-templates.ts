import { promises as fs } from 'fs';
import https from 'https';
import path from 'path';

export async function getMarmaladeTemplates(repositoryUrl: string) {
  // Fetch the directory content
  const files = await new Promise((resolve, reject) => {
    https.get(`${repositoryUrl}?ref=main`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.stringify(data)));
      res.on('error', reject);
    });
  });

  console.log(files);

  // // Filter out the YAML files
  // const yamlFiles = files.filter((file: any) => file.name.endsWith('.yaml'));

  // // Download each YAML file
  // for (const file of yamlFiles) {
  //   const rawFileUrl = `https://raw.githubusercontent.com/kadena-io/marmalade/v2/${file.path}`;
  //   const content = await new Promise((resolve, reject) => {
  //     https.get(rawFileUrl, (res) => {
  //       let data = '';
  //       res.on('data', (chunk) => (data += chunk));
  //       res.on('end', () => resolve(data));
  //       res.on('error', reject);
  //     });
  //   });
  //   await fs.writeFile(path.join('./', file.name), content);
  // }
}
