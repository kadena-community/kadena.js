import { ingest } from '@kadena/docs-tools';
import type { IScriptResult } from './types';
import { initFunc } from './utils/build';
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function (): Promise<void> {
  async function ingestion(): Promise<IScriptResult> {
    const errors = [];
    const success = [];
    const namespace = 'docs_playground';
    console.log(`\nINGESTING DATA TO "${namespace}" INDEX\n`);
    try {
      await ingest({
        sourceIdentifiers: ['src/pages/**/*.md', 'src/specs/**/*.json'],
        source: 'fs',
        db: 'Algolia',
        isDryRun: false,
        ignore: [],
        isSkipEmbeddings: true,
        namespace,
      });
      success.push(`Ingestion successful for ${namespace} index`);
    } catch (e) {
      errors.push(e);
      errors.push(`Ingestion failed for ${namespace} index`);
    }
    return {
      errors,
      success,
    };
  }

  await initFunc(ingestion, 'Ingesting data to Algolia');
})();
