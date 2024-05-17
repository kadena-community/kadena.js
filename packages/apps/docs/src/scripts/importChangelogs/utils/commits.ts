import { MAX_TRIES } from '../constants';
import { getVersions } from './misc';

export const filterCommitsWithoutData = (commit: IChangelogCommit): boolean =>
  commit.tries < MAX_TRIES && !commit.data;

export const getVersionCommits = (
  version: IChanglogPackageVersion,
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

  return [...miscCommits, ...patchCommits, ...minorCommits].flat().flat();
};

export const getCommits = (library: IChangelogPackage): IChangelogCommit[] => {
  return getVersions(library).map(getVersionCommits).flat().flat();
};

export const getCommitId = (content: string): IChangelogVersionRecord => {
  const regex = /\b[0-9a-f]{7,10}\b/;
  const match = content.match(regex);

  if (match) {
    const newContent = content
      .replace(match[0], '')
      .replace('[]', '')
      .replace('()', '')
      .replace(/^\:/, '')
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
