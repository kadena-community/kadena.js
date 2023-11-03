import { unlinkSync } from 'node:fs';

const response = await fetch(
  'https://github.com/kadena-io/pact/releases/download/v4.9.0/pact-4.9.0-linux-20.04.zip',
);

await Bun.write('pact.zip', response);

import { spawn } from 'child_process';

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

unlinkSync('pact.zip');
