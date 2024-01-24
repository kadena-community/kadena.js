import chalk from 'chalk';
import { execSync } from 'child_process';
import type { IDevnetsCreateOptions } from './devnetHelpers.js';

const volumePrefix: string = 'kadena_';
const containerDataFolder: string = '/data';
const containerPactFolder: string = '/pact-cli';
const containerPactFolderPermissions: string = 'ro';
const chainwebNodeApiPort: string = '8080';
const devnetImageName: string = 'kadena/devnet';

export const guardDockerInstalled = (): void | never => {
  try {
    execSync('docker -v', { stdio: 'pipe' });
  } catch (error) {
    if (error.stderr.includes('command not found')) {
      throw new Error('Please install Docker.');
    }
  }
};

export const guardDockerRunning = (): void | never => {
  try {
    execSync('docker ps', { stdio: 'pipe' });
  } catch (error) {
    if (error.stderr.includes('Cannot connect to the Docker daemon')) {
      throw new Error('Please make sure the Docker daemon is running.');
    }
  }
};

export const guardDocker = (): void | never => {
  guardDockerInstalled();
  guardDockerRunning();
};

export const dockerVolumeName = (containerName: string): string =>
  `${volumePrefix}${containerName}`;

const maybeCreateVolume = (useVolume: boolean, containerName: string): void => {
  if (!useVolume) {
    console.log(
      chalk.green('Not creating persistent volume as per configuration.'),
    );
    return;
  }

  const volumeName = dockerVolumeName(containerName);

  const existingVolumes = execSync('docker volume ls --format "{{.Name}}"')
    .toString()
    .trim()
    .split('\n');

  if (existingVolumes.includes(volumeName)) {
    console.log(chalk.green(`Using existing volume: ${volumeName}`));
    return;
  }

  console.log(chalk.green(`Creating volume: ${volumeName}`));

  execSync(`docker volume create ${volumeName}`);

  console.log(chalk.green(`Successfully created volume: ${volumeName}`));
};

const formatDockerRunOptions = (
  configuration: IDevnetsCreateOptions,
): string => {
  const options = ['-d'];

  if (configuration.port) {
    options.push('-p');
    options.push(`${configuration.port.toString()}:${chainwebNodeApiPort}`);
  }

  if (configuration.useVolume) {
    options.push('-v');
    options.push(
      `${dockerVolumeName(configuration.name)}:${containerDataFolder}`,
    );
  }

  if (configuration.mountPactFolder) {
    options.push('-v');
    options.push(
      `${configuration.mountPactFolder}:${containerPactFolder}:${containerPactFolderPermissions}`,
    );
  }

  options.push('--name');
  options.push(configuration.name);

  const version = configuration.version ? `:${configuration.version}` : '';

  options.push(`${devnetImageName}${version}`);

  return options.join(' ');
};

const containerExists = (name: string): boolean => {
  const existingContainers = execSync('docker ps -a --format "{{.Names}}"')
    .toString()
    .trim()
    .split('\n');
  return existingContainers.includes(name);
};

export function runDevnet(configuration: IDevnetsCreateOptions): void {
  maybeCreateVolume(!!configuration.useVolume, configuration.name);
  const dockerRunOptions = formatDockerRunOptions(configuration);

  if (containerExists(configuration.name)) {
    execSync(`docker start ${configuration.name}`);
    console.log(
      chalk.green(`Started existing container: ${configuration.name}`),
    );
    return;
  }
  execSync(`docker run ${dockerRunOptions}`);
  console.log(
    chalk.green(`New devnet container "${configuration.name}" is running`),
  );
}

export function stopDevnet(containerName: string): void {
  execSync(`docker stop ${containerName}`);
  console.log(chalk.green(`Stopped devnet container: ${containerName}`));
}

export function removeDevnet(containerName: string): void {
  execSync(`docker rm -v ${containerName}`);
}

export function removeVolume(containerName: string): void {
  execSync(`docker volume rm ${dockerVolumeName(containerName)}`);
}

export function updateDevnet(version?: string): void {
  const image = `${devnetImageName}:${version}`;
  execSync(`docker pull ${image}`);
  console.log(chalk.green(`Updated ${image}`));
}
