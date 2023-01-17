import { exec } from 'child_process';

export function execShellCommand(
  cmd: string,
  env: Record<string, string> = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      { env: { ...process.env, ...env } },
      (error, stdout: string, stderr: string) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      },
    );
  });
}
