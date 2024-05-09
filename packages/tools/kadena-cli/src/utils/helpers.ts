import { load } from 'js-yaml';
import path from 'path';
import z from 'zod';
import { defaultDevnetsPath, devnetDefaults } from '../constants/devnets.js';
import type { ICustomDevnetsChoice } from '../devnet/utils/devnetHelpers.js';
import { writeDevnet } from '../devnet/utils/devnetHelpers.js';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import {
  getNetworkDirectory,
  getNetworksSettingsFilePath,
} from '../networks/utils/networkPath.js';
import { services } from '../services/index.js';
import { KadenaError } from '../services/service-error.js';
import { CommandError, printCommandError } from './command.util.js';
import { log } from './logger.js';

export function handlePromptError(error: unknown): never {
  if (handleNoKadenaDirectory(error)) {
    process.exit(0);
  }
  if (error instanceof CommandError) {
    printCommandError(error);
  } else if (error instanceof Error) {
    if (error.message.includes('User force closed the prompt')) {
      // Usually NEVER process.exit, this one is an exception since it us the uses's intention
      process.exit(0);
    } else {
      log.debug(error);
      log.error(error.message);
    }
  } else {
    log.error('Unexpected error executing option', error);
  }
  throw new CommandError({ errors: [], exitCode: 1 });
}

export async function getExistingNetworks(): Promise<ICustomNetworkChoice[]> {
  const networkDir = getNetworkDirectory();
  if (networkDir === null) {
    throw new KadenaError('no_kadena_directory');
  }

  await services.filesystem.ensureDirectoryExists(networkDir);

  try {
    return (await services.filesystem.readDir(networkDir)).map((filename) => ({
      value: path.basename(filename.toLowerCase(), '.yaml'),
      name: path.basename(filename.toLowerCase(), '.yaml'),
    }));
  } catch (error) {
    log.error('Error reading networks directory:', error);
    return [];
  }
}

type ICustomChoice = ICustomDevnetsChoice | ICustomNetworkChoice;

export async function getConfiguration(
  configurationPath: string,
): Promise<ICustomChoice[]> {
  try {
    return (await services.filesystem.readDir(configurationPath)).map(
      (filename) => ({
        value: path.basename(filename.toLowerCase(), '.yaml'),
        name: path.basename(filename.toLowerCase(), '.yaml'),
      }),
    );
  } catch (error) {
    log.error(`Error reading ${configurationPath} directory:`, error);
    return [];
  }
}

export async function ensureDevnetsConfiguration(): Promise<void> {
  if (await services.filesystem.directoryExists(defaultDevnetsPath)) {
    return;
  }
  await services.filesystem.ensureDirectoryExists(defaultDevnetsPath);
  await writeDevnet(devnetDefaults.devnet);
}

export async function getExistingDevnets(): Promise<ICustomDevnetsChoice[]> {
  await ensureDevnetsConfiguration();

  return getConfiguration(defaultDevnetsPath);
}

// export const skipSymbol = Symbol('skip');
// export const createSymbol = Symbol('createSymbol');

export const passwordPromptTransform =
  (
    flag: string,
    useStdin = true,
  ): ((
    passwordFile: string | { _password: string },
    args: Record<string, unknown>,
  ) => Promise<string>) =>
  async (passwordFile, args) => {
    // passwordFile will be undefined if `--quiet` flag is used
    const password =
      useStdin === true && (passwordFile === '-' || passwordFile === undefined)
        ? (args.stdin as string | null)
        : typeof passwordFile === 'string'
        ? await services.filesystem.readFile(passwordFile)
        : passwordFile._password;

    if (password === null) {
      throw new CommandError({
        errors: [`Password file not found: ${passwordFile}`],
        exitCode: 1,
      });
    }

    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8 && trimmedPassword !== '') {
      throw new CommandError({
        errors: ['Password should be at least 8 characters long.'],
        exitCode: 1,
      });
    }

    if (trimmedPassword.includes('\n')) {
      log.warning(
        'Password contains new line characters. Make sure you are using the correct password.',
      );
    }

    return trimmedPassword;
  };

export const mnemonicPromptTransform =
  (
    flag: string,
  ): ((
    filepath: string | { _secret: string },
    args: Record<string, unknown>,
  ) => Promise<string>) =>
  async (filepath, args) => {
    const content =
      filepath === '-' || filepath === undefined
        ? (args.stdin as string | null)
        : typeof filepath === 'string'
        ? await services.filesystem.readFile(filepath)
        : filepath._secret;

    if (content === null) {
      throw new CommandError({
        errors: [`Mnemonic file not found: ${filepath}`],
        exitCode: 1,
      });
    }

    const trimmedContent = content.trim();

    if (trimmedContent.includes('\n')) {
      log.warning(
        'Mnemonic contains new line characters. Make sure you are using the correct Mnemonic.',
      );
    }

    return trimmedContent;
  };

const defaultNetworkSchema = z.object({
  name: z.string(),
});

export const getDefaultNetworkName = async (): Promise<string | undefined> => {
  const defaultNetworksSettingsFilePath = getNetworksSettingsFilePath();
  if (defaultNetworksSettingsFilePath === null) return;

  const isDefaultNetworkAvailable = await services.filesystem.fileExists(
    defaultNetworksSettingsFilePath,
  );

  if (!isDefaultNetworkAvailable) return;

  const content = await services.filesystem.readFile(
    defaultNetworksSettingsFilePath,
  );

  const network = content !== null ? load(content) : null;

  const parse = defaultNetworkSchema.safeParse(network);

  if (parse.success) {
    return parse.data.name;
  }
};

export const printNoKadenaDirectory = (): void => {
  log.warning(
    'No kadena directory found. Run the following command to create one:\n',
  );
  log.info('  kadena config init\n');
};

export function handleNoKadenaDirectory(error: unknown): boolean {
  if (error instanceof KadenaError) {
    if (error.code === 'no_kadena_directory') {
      printNoKadenaDirectory();
      log.debug(error);
      process.exitCode = 1;
      return true;
    }
  }
  return false;
}
