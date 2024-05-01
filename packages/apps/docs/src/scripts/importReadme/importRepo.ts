import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getUrlNameOfPageFile } from '@kadena/docs-tools';
import * as fs from 'fs';
import type { IImportReadMeItem } from '../utils';
import { TEMP_DIR } from '../utils/build';
import { DOCS_ROOT, createDir, importDocs } from './createDoc';
import { clone, removeRepoDomain } from './index';

/**
 * Removes the tempdir.
 */
export const deleteTempDir = (): void => {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
};

export const noImportRepo = async (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
): Promise<string> => {
  const url = getUrlNameOfPageFile(page, parentTree);
  const content = `---
  title: REPO ${url}
  description: This is a temporary file.
  menu: REPO ${url}
  label: REPO ${url}
  layout: full
---

  # ${url}  
  This is a temporary file.
  You are doing a quick import. This does not import external Repo READMEs.  
  But creates this temporary empty files.

  :::warning Warning  
  This is NOT the actual content that will go to production.
  To have this content, please run
  \`pnpm run dev\`  
  :::

  ## IConfigTreeItem in the config.yaml
  \`\`\` IConfigTreeItem
  ${JSON.stringify(page, null, 2)}
  \`\`\`
`;

  createDir(`${DOCS_ROOT}/${page.destination}`);

  fs.writeFileSync(`${DOCS_ROOT}/${page.destination}/index.md`, content, {
    flag: 'w',
  });

  return content;
};

export const importRepo = async (item: IImportReadMeItem): Promise<void> => {
  await clone(item.repo);
  await importDocs(
    `${TEMP_DIR}${removeRepoDomain(item.repo)}${item.file}`,
    item,
  );
};
