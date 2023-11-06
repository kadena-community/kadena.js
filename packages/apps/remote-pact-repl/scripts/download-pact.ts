import { spawn } from 'node:child_process';
import fs, { unlink } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

const downloadFile = async (url, folder = '.') => {
  const res = await fetch(url);
  const destination = path.resolve('./', folder);
  const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
};
async function main() {
  await downloadFile(
    'https://github.com/kadena-io/pact/releases/download/v4.9.0/pact-4.9.0-linux-20.04.zip',
    'pact.zip',
  );

  function runCommand(command: string, args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const child = spawn(command, args, { stdio: 'inherit' });
      child.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `Command "${command} ${args.join(' ')}" exited with code ${code}`,
            ),
          );
        }
      });
    });
  }

  await runCommand('unzip', ['-o', 'pact.zip', '-d', 'pact-bin']);
  await runCommand('chmod', ['+x', 'pact-bin/pact']);

  unlink('pact.zip', () => {});
}

main()
  .catch(console.error)
  .finally(() => {});
