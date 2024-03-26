import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import find from 'find-process';
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

export interface ProcessQuery {
  name?: string;
  port?: number | string;
  pid?: number;
}

export function findProcess(query: ProcessQuery) {
  const { name, port, pid } = query;
  if (name) {
    return find('name', name);
  }
  if (port) {
    return find('port', port);
  }
  if (pid) {
    return find('pid', pid);
  }
  return null;
}

export async function killProcess(query: ProcessQuery) {
  const proc = await findProcess(query);
  if (proc) {
    const p = proc.find((p) => p.name === query.name) ?? proc[0];
    process.kill(p.pid);
  }
}
export function isProcessRunning(query: ProcessQuery) {
  const proc = findProcess(query);
  return proc !== null;
}
