import { generateTemplates } from '@kadena/pactjs-generator';
import type { Command } from 'commander';
import ora from 'ora';
import { join } from 'path';
import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { contractOptions } from '../options/contractOptions.js';
import { getFilesAndContents, getTemplateFilesPaths } from '../utils/utils.js';

export const createTemplateGenerateCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'template-generate',
  'Generate statically typed generators for templates',
  [
    contractOptions.clean(),
    contractOptions.fileOrDirectory(),
    contractOptions.out(),
    globalOptions.directory(),
  ],
  async (option) => {
    const { clean } = await option.clean();
    const { fileOrDirectory } = await option.fileOrDirectory();
    const { out } = await option.out();
    const { directory } = await option.directory();

    log.debug('template-generate:action', {
      clean,
      fileOrDirectory,
      out,
    });

    const loading = ora('Generating template...').start();
    try {
      const filepaths = await Promise.all(
        fileOrDirectory.map(async (path) => await getTemplateFilesPaths(path)),
      );
      const flattenedFilepaths = filepaths.flat();

      const filesAndContents = await getFilesAndContents(flattenedFilepaths);

      const generatedTemplateClient = generateTemplates(
        filesAndContents,
        '1.0',
      );
      const outputDirOrFile = join(directory, out);

      if (outputDirOrFile.endsWith('ts')) {
        const outputFile = outputDirOrFile;
        if ((await services.filesystem.fileExists(outputFile)) && clean) {
          log.info(`Cleaning ${outputFile}`);
          await services.filesystem.deleteFile(outputFile);
        }
        log.info(`Writing to file ${outputFile}`);
        await services.filesystem.writeFile(
          outputFile,
          generatedTemplateClient,
        );
      } else {
        const outputDir = outputDirOrFile;
        log.info(`Output directory ${outputDir}`);
        if (!(await services.filesystem.directoryExists(outputDir))) {
          log.info(`Creating ${outputDir}`);
          await services.filesystem.ensureDirectoryExists(outputDir);
        }
        const destination = `${join(outputDir, 'index.ts')}`;
        if ((await services.filesystem.fileExists(destination)) && clean) {
          log.info(`Cleaning ${destination}`);
          await services.filesystem.deleteFile(destination);
        }
        log.info(`Writing to directory ${destination}`);
        await services.filesystem.writeFile(
          destination,
          generatedTemplateClient,
        );
      }
      loading.succeed('Template generated successfully\n');
    } catch (error) {
      loading.fail('Template generation failed');
      if (error instanceof Error) {
        log.error(error.message);
      } else {
        throw error;
      }
    }
  },
);
