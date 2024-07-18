import { generateTemplates, parseTemplate } from '@kadena/pactjs-generator';
import type { Command } from 'commander';
import debug from 'debug';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { basename, extname, join } from 'path';
import { sync as rimrafSync } from 'rimraf';
import type { z } from 'zod';
import type { TTemplateGenerateOptions } from '.';

export const templateGenerate =
  (program: Command, version: string) => (args: TTemplateGenerateOptions) => {
    try {
      const { clean, file, out } = args;

      // find all paths
      const files = getTemplateFilesPaths(file);

      // parse templates
      const filesAndContents = files.map((filepath, __, filesArr) => {
        console.log(`Parsing template(s) from ${filepath}`);
        const name = basename(filepath, extname(filepath));
        const isUniqueName: boolean =
          filesArr.filter((f) => basename(f, extname(f)) === name).length === 1;

        return {
          name: isUniqueName ? name : basename(filepath),
          template: parseTemplate(readFileSync(filepath, 'utf8')),
        };
      });

      const generatedTemplateClient = generateTemplates(
        filesAndContents,
        version,
      );
      const outputDirOrFile = join(process.cwd(), out);

      if (outputDirOrFile.endsWith('ts')) {
        const outputFile = outputDirOrFile;
        if (existsSync(outputFile) && clean === true) {
          console.log(`Cleaning ${outputFile}`);
          rimrafSync(outputFile);
        }
        console.log(`Writing to file ${outputFile}`);
        writeFileSync(outputFile, generatedTemplateClient);
      } else {
        console.log(`Output directory ${outputDirOrFile}`);
        const outputDir = outputDirOrFile;

        if (!existsSync(outputDir)) {
          console.log(`Creating ${outputDir}`);
          mkdirSync(outputDir);
        }
        debug('output-dir')(outputDir);
        const destination = `${join(outputDir, 'index.ts')}`;
        if (existsSync(destination) && clean === true) {
          console.log(`Cleaning ${destination}`);
          rimrafSync(destination);
        }
        console.log(`Writing to directory ${destination}`);
        writeFileSync(destination, generatedTemplateClient);
      }
    } catch (error) {
      console.log('an error occurred');
      if (Array.isArray(error.errors)) {
        const errors = (error as z.ZodError).errors;
        errors.forEach((e) => console.log(e.message));
        program.error('');
      }
      throw error;
    }
  };

function getTemplateFilesPaths(fileOrDirectory: string): string[] {
  debug('getTemplateFilesPaths')('fileOrDirectory', fileOrDirectory);
  const lstat = lstatSync(join(process.cwd(), fileOrDirectory));

  if (lstat.isDirectory()) {
    return readdirSync(fileOrDirectory, 'utf8').map((filename) =>
      join(process.cwd(), fileOrDirectory, filename),
    );
  }
  return [fileOrDirectory];
}
