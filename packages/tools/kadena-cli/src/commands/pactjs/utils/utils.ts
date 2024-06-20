import { parseTemplate } from '@kadena/pactjs-generator';
import { basename, extname, join } from 'path';
import { services } from '../../../services/index.js';
import { log } from '../../../utils/logger.js';

interface ITemplateResult {
  name: string;
  template: ReturnType<typeof parseTemplate>;
}

export async function getTemplateFilesPaths(
  fileOrDirectory: string,
): Promise<string[]> {
  const lstat = await services.filesystem.lstat(
    join(process.cwd(), fileOrDirectory),
  );

  if (lstat.isDirectory() === true) {
    const filenames = await services.filesystem.readDir(fileOrDirectory);
    return filenames.map((filename) =>
      join(process.cwd(), fileOrDirectory, filename),
    );
  }
  return [fileOrDirectory];
}

export async function getFilesAndContents(
  filepaths: string[],
): Promise<ITemplateResult[]> {
  const filesAndContents = await Promise.all(
    filepaths.map(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      async (filepath, _, filesArr): Promise<ITemplateResult | null> => {
        log.info(`Parsing template(s) from ${filepath}`);
        const name = basename(filepath, extname(filepath));
        const isUniqueName: boolean =
          filesArr.filter((f) => basename(f, extname(f)) === name).length === 1;
        const template = await services.filesystem.readFile(filepath);
        if (template !== null) {
          return {
            name: isUniqueName ? name : basename(filepath),
            template: parseTemplate(template),
          };
        }
        return null;
      },
    ),
  );

  return filesAndContents.filter(
    (result): result is ITemplateResult => result !== null,
  );
}
