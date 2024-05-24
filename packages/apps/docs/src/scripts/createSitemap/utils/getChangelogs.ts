import { REPOS } from '@/scripts/importChangelogs/constants';
import { getLastModifiedDate } from '@/scripts/importChangelogs/utils/enrichPackageContent';
import { getVersions } from '@/scripts/importChangelogs/utils/misc';
import { formatDate } from './formatDate';

export const getChangelogs = (
  root: string,
  innerChangelogs: IChangelogComplete,
): string => {
  return REPOS.map((repo: IRepo) => {
    const pkg = innerChangelogs[repo.slug];
    const versions = getVersions(pkg);
    const lastModifiedDate = getLastModifiedDate(versions[0]);

    return `
    <url>
        <loc>${root}/${repo.slug}</loc>
        ${
          lastModifiedDate &&
          `<lastmod>${formatDate(lastModifiedDate)}</lastmod>`
        }
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>`;
  }).join('');
};
