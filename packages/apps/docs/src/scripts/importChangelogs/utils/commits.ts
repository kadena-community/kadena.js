import { MAX_TRIES } from '../constants';
import { getVersions } from './misc';

export const filterCommitsWithoutData = (commit: IChangelogCommit): boolean =>
  commit.tries < MAX_TRIES && !commit.data;

// returns an array of all commits of a version
export const getVersionCommits = (
  version: IChangelogPackageVersion,
): IChangelogCommit[] => {
  const patchCommits =
    version.patches.map((val) => {
      return val.commits;
    }) ?? [];
  const minorCommits =
    version.minors.map((val) => {
      return val.commits;
    }) ?? [];
  const miscCommits =
    version.miscs.map((val) => {
      return val.commits;
    }) ?? [];

  return [...miscCommits, ...patchCommits, ...minorCommits].flat();
};

// returns all the commits for a certain package
export const getCommits = (pkg: IChangelogPackage): IChangelogCommit[] => {
  return getVersions(pkg).map(getVersionCommits).flat();
};

/**
 * this will check the content string for commit hashes
 * and return an object with an array of hashes (there can be more hashes in content)
 * the label will be the content without the hash
 * there is a tries property set to 0.
 * the tries is the amount of re-tries that can be done for getting the data of that commit hash from github
 * after 3 tries we can presume that the github api does not return data for this commit, for what ever reason
 */
export const getCommitId = (content: string): IChangelogVersionRecord => {
  const regex = /\b[0-9a-f]{7,10}\b/;
  const match = content.match(regex);

  if (match) {
    const newContent = content
      .replace(match[0], '')
      .replace('[]', '')
      .replace('()', '')
      .replace(/^\:/, '')
      .replace(/\[``\]\(\S*/, '')
      .trim();

    const [hash] = match;
    return {
      commits: [
        {
          hash,
          tries: 0,
        },
      ],
      label: newContent,
      prIds: [],
    };
  }

  return { label: content, commits: [], prIds: [] };
};
