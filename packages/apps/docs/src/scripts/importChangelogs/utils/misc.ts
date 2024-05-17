import { removeRepoDomain } from '@/scripts/importReadme';
import { TEMP_DIR } from '@/scripts/utils/build';
import fs from 'fs';
import { CHANGELOGFILENAME } from '../constants';

export const writeContent = (content: IChangelogComplete): void => {
  fs.writeFileSync(CHANGELOGFILENAME, JSON.stringify(content, null, 2));
};

export const getChangelog = (repo: IRepo): string => {
  return fs.readFileSync(
    `${TEMP_DIR}${removeRepoDomain(repo.repo)}${repo.directory}/${repo.fileName}`,
    'utf-8',
  );
};

export const getLibraries = (
  content: IChangelogComplete,
): IChangelogPackage[] => {
  return Object.entries(content).map(([, library]) => library);
};

export const getVersions = (
  library: IChangelogPackage,
): IChanglogPackageVersion[] => {
  if (!library.content) return [];
  return Object.entries(library.content).map(([, version]) => version);
};
