import { MAX_TRIES } from '../constants';
import { getVersions } from './misc';

export const filterPRsWithoutData = (pr: IChangelogPR): boolean =>
  pr.tries < MAX_TRIES && !pr.data;

export const getVersionPRs = (
  version: IChangelogPackageVersion,
): IChangelogPR[] => {
  const patchCommits =
    version.patches.map((val) => {
      return val.prIds;
    }) ?? [];
  const minorCommits =
    version.minors.map((val) => {
      return val.prIds;
    }) ?? [];
  const miscCommits =
    version.miscs.map((val) => {
      return val.prIds;
    }) ?? [];

  return [...miscCommits, ...patchCommits, ...minorCommits].flat().flat();
};

export const getPrs = (library: IChangelogPackage): IChangelogPR[] => {
  return getVersions(library).map(getVersionPRs).flat().flat();
};

export const getPrId = (content: string): IChangelogVersionRecord => {
  const regex = /#(\d+)/g;
  const prIds: IChangelogPR[] = [];
  const matches = content.match(regex);

  matches?.forEach((match: string, idx: number) => {
    content = content.replace(match, '');
    prIds.push({ id: parseInt(match.substring(1)), tries: 0, commits: [] });
  });

  content = content
    .replace('[]', '')
    .replace(/\(?[, ]*\)/g, '')
    .replace(/^\:/, '')
    .trim();

  return { label: content, prIds, commits: [] };
};
