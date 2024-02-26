import type { ChildProcessWithoutNullStreams } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { rm } from 'node:fs/promises';
import { join } from 'path';
import type { PactServerConfig, PactServerNetworkConfig } from '../../config';
import { createPactServerConfig } from '../../config';
import { getUuid, runBin } from '../../utils';
import type { PactToolboxNetworkApi } from '../types';

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
  const toolboxDir = join(process.cwd(), '.pact-toolbox');
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

export class PactServerNetwork implements PactToolboxNetworkApi {
  public id = getUuid();
  private child?: ChildProcessWithoutNullStreams;
  private configPath?: string;
  private serverConfig: Required<PactServerConfig>;

  constructor(
    private networkConfig: PactServerNetworkConfig,
    private silent: boolean,
    private isStateless: boolean = false,
  ) {
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

  async start() {
    this.configPath = await writePactServerConfig(
      this.serverConfig,
      'yaml',
      this.isStateless ? this.id : '',
    );
    this.child = await runBin('pact', ['-s', this.configPath], {
      silent: this.silent,
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

  async restart() {
    await this.stop();
    await this.start();
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
  silent: boolean = true,
  isStateless: boolean = false,
) {
  const server = new PactServerNetwork(networkConfig, silent, isStateless);
  await server.start();
  return server;
}
