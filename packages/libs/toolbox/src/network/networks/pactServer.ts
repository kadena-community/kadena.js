import type { ChildProcessWithoutNullStreams } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { rm } from 'node:fs/promises';
import { join } from 'path';
import type { PactServerConfig, PactServerNetworkConfig } from '../../config';
import { createPactServerConfig } from '../../config';
import { findProcess, getUuid, killProcess, runBin } from '../../utils';
import type { ToolboxNetworkApi, ToolboxNetworkStartOptions } from '../types';

export function configToYamlString(config: PactServerConfig) {
  let configString = `# This is a generated file, do not edit manually\n`;
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      configString += `${key}: [${value.join(', ')}]\n`;
    } else {
      configString += `${key}: ${value}\n`;
    }
  }
  return configString;
}

export function configToJSONString(config: PactServerConfig) {
  return JSON.stringify(config, null, 2);
}

export async function writePactServerConfig(
  config: PactServerConfig,
  format: 'yaml' | 'json' = 'yaml',
  id: string,
) {
  const toolboxDir = join(process.cwd(), '.kadena/toolbox/pact');
  await mkdir(toolboxDir, { recursive: true });
  const configPath = join(toolboxDir, `pact-server-config${id}${format}`);
  if (config.persistDir) {
    config.persistDir = join(config.persistDir, id);
  }
  if (config.logDir) {
    config.logDir = join(config.logDir, id);
  }
  // write config to file
  await writeFile(
    configPath,
    format === 'yaml' ? configToYamlString(config) : configToJSONString(config),
  );
  return configPath;
}

export async function isPactServerRunning(port: number | string) {
  let p = await findProcess({ port });
  if (!p || p.length === 0) {
    return false;
  }
  if (p.some((proc) => proc.name === 'pact')) {
    return true;
  }
  p = await findProcess({ name: 'pact' });

  if (!p || p.length === 0) {
    return false;
  }
  return true;
}

export class PactServerNetwork implements ToolboxNetworkApi {
  public id = getUuid();
  private child?: ChildProcessWithoutNullStreams;
  private configPath?: string;
  private serverConfig: Required<PactServerConfig>;

  constructor(private networkConfig: PactServerNetworkConfig) {
    this.serverConfig = createPactServerConfig(
      this.networkConfig?.serverConfig,
    );
  }

  getServicePort() {
    return this.serverConfig.port;
  }

  isOnDemandMining() {
    return false;
  }

  getOnDemandUrl() {
    return '';
  }

  getServiceUrl(): string {
    return `http://localhost:${this.getServicePort()}`;
  }

  async start({
    silent = false,
    isStateless = false,
    conflict = 'error',
  }: ToolboxNetworkStartOptions = {}) {
    this.configPath = await writePactServerConfig(
      this.serverConfig,
      'yaml',
      isStateless ? this.id : '',
    );
    const port = this.serverConfig.port;
    if (await isPactServerRunning(port)) {
      if (conflict === 'error') {
        throw new Error(`Pact server is already running on port ${port}`);
      }
      if (conflict === 'replace') {
        await killProcess({ port, name: 'pact' });
      }
    }
    this.child = await runBin('pact', ['-s', this.configPath], {
      silent,
      resolveIf: (data) => data.includes('[api] starting on port'),
    });
  }

  async stop() {
    if (this.child) {
      this.child.kill();
      if (this.configPath) {
        // remove config file
        await rm(this.configPath, { force: true });
      }
    }
  }

  async restart(options?: ToolboxNetworkStartOptions) {
    await this.stop();
    await this.start(options);
  }

  async isOk() {
    const res = await fetch(this.getServiceUrl());
    if (res.ok) {
      return true;
    }
    return false;
  }
}

export async function startPactServerNetwork(
  networkConfig: PactServerNetworkConfig,
  startOptions?: ToolboxNetworkStartOptions,
) {
  const server = new PactServerNetwork(networkConfig);
  await server.start(startOptions);
  return server;
}
