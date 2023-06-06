import { spawn } from 'cross-spawn';

export const spawned = (
  command: string,
  silent: boolean = false,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const s = spawn('sh', ['-c', command], {
      stdio: silent ? 'pipe' : 'inherit',
    });
    s.on('error', reject);
    s.on('exit', resolve);
  });
};
