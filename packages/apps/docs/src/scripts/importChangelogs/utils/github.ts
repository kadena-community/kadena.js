import { getCommitData, getPRData } from '../api';
import { MAXCALLS, errors } from '../constants';
import { filterCommitsWithoutData, getCommits } from './commits';
import { writeContent } from './content';
import { getPackages } from './misc';
import { filterPRsWithoutData, getPrs } from './prs';

/**
 * do all the github api calls for the commits and prs without data
 */
export const getGitHubData = async (
  content: IChangelogComplete,
): Promise<void> => {
  const pkgs = getPackages(content);
  for (let i = 0; i < pkgs.length; i++) {
    const pkg = pkgs[i];
    const commits = getCommits(pkg)
      .filter(filterCommitsWithoutData)
      .slice(0, MAXCALLS);

    const prs = getPrs(pkg).filter(filterPRsWithoutData).slice(0, MAXCALLS);

    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];

      await getCommitData(pkg, commit);
      writeContent(content);
    }

    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];

      await getPRData(pkg, pr);
      writeContent(content);
    }

    /**
     * check how many commits and prs do not have data
     * there is a maximum amount of github API calls that can be done before the rate limit is reached
     * this function will check if all commits and PRs have data and are locked.
     * if not, there will be an error. and we need to run the function by hand
     */
    const commitCount = getCommits(pkg).filter(filterCommitsWithoutData);
    const prCount = getPrs(pkg).filter(filterPRsWithoutData);

    if (commitCount.length) {
      errors.push(
        `${pkg.repo}: ${pkg.directory} ${pkg.fileName} still has ${commitCount.length} commits without data`,
      );
    }
    if (prCount.length) {
      errors.push(
        `${pkg.repo}: ${pkg.directory} ${pkg.fileName} still has ${prCount.length} prs without data`,
      );
    }
  }
};
