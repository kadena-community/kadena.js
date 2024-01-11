import type { IScriptResult } from '@kadena/docs-tools';
import { getParentTreeFromPage } from '@kadena/docs-tools';
import { copyPage } from '.';
import { getPageFromPath } from '../fixLocalLinks/utils/getPageFromPath';

export type IEventType = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';

const errors: string[] = [];
const success: string[] = [];

export const moveSinglePage =
  (path: string) => async (): Promise<IScriptResult> => {
    errors.length = 0;
    success.length = 0;

    const page = await getPageFromPath(path);
    if (!page) {
      errors.push('page not found in config');
    } else {
      const parentTree = await getParentTreeFromPage(page);

      const parentDir = parentTree.map((p) => p.url).join('');

      copyPage(parentDir, page);

      success.push(`There were no issues with copying the page: ${path}`);
    }

    return {
      errors,
      success,
    };
  };
