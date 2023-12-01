import chalk from 'chalk';
import { execSync } from 'child_process';
import type { IDevnetsCreateOptions } from './devnetHelpers.js';

const volumePrefix: string = 'kadena_';
const containerDataFolder: string = '/data';
const containerPactFolder: string = '/pact-cli';
const containerPactFolderPermissions: string = 'ro';
const chainwebNodeApiPort: string = '8080';
const devnetImageName: string = 'kadena/devnet';

export function isDockerInstalled(): boolean {
  try {
    execSync('docker -v');
    return true;
  } catch (error) {
    return false;
  }
}

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

  try {
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
  } catch (error) {
    console.log(
      chalk.red(
        `Something went wrong with the Docker volume: ${error.message}`,
      ),
    );
  }
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
  try {
    const existingContainers = execSync('docker ps -a --format "{{.Names}}"')
      .toString()
      .trim()
      .split('\n');
    return existingContainers.includes(name);
  } catch (error) {
    console.log(
      chalk.red(
        `Error checking if the container "${name}" already exists: ${error.message}`,
      ),
    );
    return false;
  }
};

export function runDevnet(configuration: IDevnetsCreateOptions): void {
  maybeCreateVolume(!!configuration.useVolume, configuration.name);
  const dockerRunOptions = formatDockerRunOptions(configuration);

  try {
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
  } catch (error) {
    console.log(chalk.red(`Failed to run devnet: ${error.message}`));
  }
}

export function stopDevnet(containerName: string): void {
  try {
    execSync(`docker stop ${containerName}`);
    console.log(chalk.green(`Stopped devnet container: ${containerName}`));
  } catch (error) {
    console.log(chalk.red(`Failed to stop devnet: ${error.message}`));
  }
}

export function removeDevnet(containerName: string): void {
  execSync(`docker rm -v ${containerName}`);
}

export function removeVolume(containerName: string): void {
  execSync(`docker volume rm ${dockerVolumeName(containerName)}`);
}

export function updateDevnet(version?: string): void {
  const image = `${devnetImageName}:${version}`;
  try {
    execSync(`docker pull ${image}`);
    console.log(chalk.green(`Updated ${image}`));
  } catch (error) {
    console.log(chalk.red(`Failed to update ${image}`));
  }
}
