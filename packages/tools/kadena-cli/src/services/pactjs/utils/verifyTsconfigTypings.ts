import { log } from '../../../utils/logger.js';
import { fileSystemService } from '../../fs/fs.service.js';

export async function verifyTsconfigTypings(
  tsconfigPath: string | undefined,
): Promise<void> {
  if (tsconfigPath === null || tsconfigPath === undefined) {
    log.error('Could not find tsconfig.json, skipping types verification');
    return;
  }

  log.info(`Verifying tsconfig.json at \`${tsconfigPath}\``);
  try {
    const tsconfig = await fileSystemService.readFile(tsconfigPath);

    if (tsconfig === null) {
      log.error('tsconfig.json file is empty or could not be read');
      return;
    }

    if (!tsconfig.includes('.kadena/pactjs-generated')) {
      log.warning(`Add .kadena/pactjs-generated to tsconfig.json.
{ "compilerOptions": { "types": [".kadena/pactjs-generated"] } }`);
    }
  } catch (error) {
    log.error(
      `Failed to read tsconfig.json at \`${tsconfigPath}\`: ${error.message}`,
    );
  }
}
