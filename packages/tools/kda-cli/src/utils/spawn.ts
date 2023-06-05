import { spawn } from 'child_process';

export const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 12,
});
export const getDecimal = (n: number) => decimalFormatter.format(n);

export const spawned = (command: string) => {
  return new Promise((resolve, reject) => {
    const s = spawn('/usr/bin/sh', ['-c', command], {
      stdio: 'inherit',
    });
    s.on('error', reject);
    s.on('exit', resolve);
  });
};
