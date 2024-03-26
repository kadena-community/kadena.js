import defu from 'defu';
import createJiti from 'jiti';
import { join } from 'node:path';
import { PactToolboxClient } from '../client';
import type { PactToolboxConfigObj } from '../config';
import { resolveConfig } from '../config';
import type { StartLocalNetworkOptions } from '../network';
import { startLocalNetwork } from '../network';
import { logger } from '../utils';

export interface ToolboxScriptContext {
  client: PactToolboxClient;
  args: Record<string, unknown>;
}

export interface ToolboxScriptOptions {
  autoStartNetwork?: boolean;
  persist?: boolean;
  startNetworkOptions?: Partial<StartLocalNetworkOptions>;
  configOverrides?: Partial<PactToolboxConfigObj>;
  network?: string;
}
export interface ToolboxScript extends ToolboxScriptOptions {
  run: (ctx: ToolboxScriptContext) => Promise<void>;
}

export function createScript(options: ToolboxScript) {
  return options;
}

export interface RunScriptOptions {
  network?: string;
  args?: Record<string, unknown>;
  config?: PactToolboxConfigObj;
  client?: PactToolboxClient;
  scriptOptions?: ToolboxScriptOptions;
}
export async function runScript(
  script: string,
  { network, args = {}, config, client, scriptOptions }: RunScriptOptions,
): Promise<void> {
  if (!config) {
    config = await resolveConfig();
  }

  const scriptsDir = config.scriptsDir ?? 'scripts';
  const jiti = createJiti(undefined as unknown as string, {
    interopDefault: true,
    requireCache: false,
    esmResolve: true,
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
  });
  const tryResolve = (id: string) => {
    try {
      return jiti.resolve(join(process.cwd(), scriptsDir, id), {
        paths: [process.cwd()],
      });
    } catch {}
  };
  const scriptPath = tryResolve(script);
  if (!scriptPath) {
    throw new Error(`Script ${script} not found`);
  }

  const scriptObject = jiti(scriptPath);
  if (typeof scriptObject !== 'object') {
    throw new Error(`Script ${script} should export an object with run method`);
  }
  const options = defu(scriptOptions, scriptObject) as ToolboxScript;
  if (options.configOverrides) {
    config = defu(
      options.configOverrides,
      config,
    ) as Required<PactToolboxConfigObj>;
  }
  if (!client) {
    client = new PactToolboxClient(config, network ?? options.network);
  }
  client.setConfig(config);
  try {
    let n;
    if (options.autoStartNetwork) {
      n = await startLocalNetwork(config, {
        enableProxy: true,
        ...options.startNetworkOptions,
        network: network ?? options.network,
        client,
      });
    }
    const context = {
      client,
      args,
    };
    await options.run(context);
    if (!options.persist) {
      if (n) {
        await n.stop();
      }
      process.exit(0);
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
