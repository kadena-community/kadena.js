import { getCommitData, getPRData } from '../api';
import { MAXCALLS, errors } from '../constants';
import { filterCommitsWithoutData, getCommits } from './commits';
import { getLibraries, writeContent } from './misc';
import { filterPRsWithoutData, getPrs } from './prs';

export const getGitHubData = async (
  content: IChangelogComplete,
): Promise<void> => {
  const libraries = getLibraries(content);
  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    const commits = getCommits(library)
      .filter(filterCommitsWithoutData)
      .slice(0, MAXCALLS);

    const prs = getPrs(library).filter(filterPRsWithoutData).slice(0, MAXCALLS);

    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];

      await getCommitData(library, commit);
      writeContent(content);
    }

    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];

      await getPRData(library, pr);
      writeContent(content);
    }

    //check how many commits and prs do not have data
    const commitCount = getCommits(library).filter(filterCommitsWithoutData);
    const prCount = getPrs(library).filter(filterPRsWithoutData);

    if (commitCount.length) {
      errors.push(
        `${library.repo}: ${library.directory} ${library.fileName} still has ${commitCount.length} commits without data`,
      );
    }
    if (prCount.length) {
      errors.push(
        `${library.repo}: ${library.directory} ${library.fileName} still has ${prCount.length} prs without data`,
      );
    }
  }
};
