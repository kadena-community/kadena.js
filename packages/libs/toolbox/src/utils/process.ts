import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';

export interface RunBinOptions {
  silent?: boolean;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  resolveIf?: (data: string) => boolean;
}
export function runBin(
  bin: string,
  args: string[],
  {
    cwd = process.cwd(),
    silent = false,
    env = process.env,
    resolveIf = () => true,
  }: RunBinOptions,
): Promise<ChildProcessWithoutNullStreams> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { cwd, env });
    child.stdout.on('data', (data) => {
      const s = data.toString();
      if (resolveIf(s)) {
        resolve(child);
      }
      if (!silent) {
        console.log(s);
      }
    });

    child.stderr.on('data', (data) => {
      const s = data.toString();
      if (!s.includes('chainweb-node: SignalException 15')) {
        console.error(data.toString());
      }
    });

    child.on('error', (err) => {
      reject(err);
    });

    cleanUpProcess(async (signal) => {
      child.kill(signal);
      await new Promise((resolve) => child.on('exit', resolve));
    });
  });
}

export function cleanUpProcess(
  clean: (signal?: NodeJS.Signals) => Promise<void>,
) {
  process.once('SIGINT', async () => {
    await clean('SIGINT');
  });

  process.once('SIGTERM', async () => {
    await clean('SIGTERM');
  });
}
