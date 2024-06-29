import * as fs from 'fs';
import path from 'node:path';
import type { IMetaData } from '../../shared/index.js';
import { CHUNK_SIZE } from '../../shared/index.js';
import { Algolia } from '../client/algolia.js';
import { fetchDocuments, sources } from '../fetcher/index.js';
import { parseDocument } from '../parser/index.js';
import { generateId } from '../util/crypto.js';
import ora from '../util/ora.js';
import { getInitUsage } from '../util/usage.js';

const targets = {
  Algolia,
};

interface IOptions {
  source?: string;
  sourceIdentifiers: string[];
  ignore: string[];
  db?: string;
  namespace: string;
  isDryRun: boolean;
}

const isValidSource = (source?: string): source is keyof typeof sources =>
  Boolean(source && source in sources);
const isValidTarget = (target?: string): target is keyof typeof targets =>
  Boolean(target && target in targets);

export const ingest = async (options: IOptions): Promise<void> => {
  const { source, sourceIdentifiers, ignore, db, namespace, isDryRun } =
    options;

  if (!isValidSource(source)) throw new Error(`Invalid --source: ${source}`);
  if (!isValidTarget(db)) throw new Error(`Invalid --db: ${db}`);
  const spinner = ora(`Fetching files`).start();

  const files = await fetchDocuments(source, sourceIdentifiers, {
    ignore,
  });

  spinner.succeed();

  if (files.length > 0) {
    const spinner = ora('Creating and upserting vector embeddings').start();

    const DB = new targets[db]();

    const counters = {
      files: files.length,
      vectors: 0,
      usage: getInitUsage(),
    };

    try {
      for (const file of files) {
        const { content, url, filePath } = file;

        if (!content) continue;

        spinner.text = `Creating and upserting vector embedding for: ${filePath}`;

        const { title, sections } = await parseDocument(
          filePath,
          content,
          CHUNK_SIZE,
        );

        console.log({
          title,
          sections,
        });

        if (isDryRun) continue;
        spinner.text = `Creating and upserting vector embedding for: ${filePath}`;

        const vectors = sections.map((section) => {
          // eslint-disable-next-line prefer-template
          const id = generateId(filePath + '\n' + section.content.trim());
          // const id = generateId(`${filePath}'\n'${section.content.trim()}`);
          const metadata: IMetaData = {
            title: title || '',
            url,
            filePath,
            content: section.content,
            header: section.header,
            tags: section.tags,
          };
          console.log('metadata: ', metadata);
          return { id, metadata };
        });

        console.log('vectors: ', vectors);
        const fileDest = path.join('./dump', '', `${filePath}.json`);
        const dirname = path.dirname(fileDest);
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }

        fs.writeFileSync(fileDest, JSON.stringify(vectors), 'utf-8');

        const insertedVectorCount = await DB.upsertVectors({
          namespace,
          vectors,
        });

        counters.vectors += insertedVectorCount;
      }

      spinner.succeed('Creating and upserting vectors');
    } catch (error) {
      console.log(error);
      if (error instanceof Error) spinner.fail(error.message);
      else throw error;
    } finally {
      const messages = [
        `Fetched ${counters.files} file(s) from ${source}`,
        `upserted ${counters.vectors} vectors to ${db}`,
      ];
      ora(messages.join(', ')).info();
    }
  } else {
    throw new Error(
      `Unable to find files to ingest (source: ${source}, patterns: ${sourceIdentifiers.join(',')})`,
    );
  }
};
