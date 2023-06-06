import { spawn } from 'child_process';

export const spawned = (
  command: string,
  silent: boolean = false,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const s = spawn('/usr/bin/sh', ['-c', command], {
      stdio: silent ? 'pipe' : 'inherit',
    });
    s.on('error', reject);
    s.on('exit', resolve);
  });
};
