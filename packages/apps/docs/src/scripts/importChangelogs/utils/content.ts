import { removeRepoDomain } from '@/scripts/importReadme';
import { TEMP_DIR } from '@/scripts/utils/build';
import fs from 'fs';
import { CHANGELOGFILENAME, CURRENTPACKAGE } from '../constants';

export const writeContent = (content: IChangelogComplete): void => {
  fs.writeFileSync(CHANGELOGFILENAME, JSON.stringify(content, null, 2));
};

export const getChangelog = (repo: IRepo): string => {
  if (repo.repoName === CURRENTPACKAGE) {
    return fs.readFileSync(
      `${process.cwd()}/../../..${repo.directory}/${repo.fileName}`,
      'utf-8',
    );
  }

  return fs.readFileSync(
    `${TEMP_DIR}${removeRepoDomain(repo.repo)}${repo.directory}/${repo.fileName}`,
    'utf-8',
  );
};
