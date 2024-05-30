import type { IScriptResult } from '@kadena/docs-tools';

import { errors, success } from './constants';
import { checkUrlCreator } from './utils/checkUrlCreator';
import { getProductionSitemapLinks } from './utils/getProductionSitemapLinks';
import { getSitemapLinks } from './utils/getSitemapLinks';

export const checkRedirects = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;
  const productionSitemapUrls = await getProductionSitemapLinks();
  const sitemapUrls = await getSitemapLinks();

  const checkUrl = checkUrlCreator(sitemapUrls);
  productionSitemapUrls.forEach(checkUrl);

  if (!errors.length) {
    success.push('There were no redirect issues found');
  }

  return { success, errors };
};
