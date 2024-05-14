import { MAX_TRIES } from '../constants';
import { getVersions } from './misc';

export const filterPRsWithoutData = (pr: IGHPR): boolean =>
  pr.tries < MAX_TRIES && !pr.data;

export const getPrs = (library: IChangelog): IGHPR[] => {
  return getVersions(library)
    .map((version) => {
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

      return [...miscCommits, ...patchCommits, ...minorCommits];
    })
    .flat()
    .flat();
};

export const getPrId = (content: string): IChangelogRecord => {
  const regex = /#(\d+)/g;
  const prIds: IGHPR[] = [];
  const matches = content.match(regex);

  matches?.forEach((match: string, idx: number) => {
    content = content.replace(match, '');
    prIds.push({ id: parseInt(match.substring(1)), tries: 0 });
  });

  content = content
    .replace('[]', '')
    .replace(/\(?[, ]*\)/g, '')
    .replace(/^\:/, '')
    .trim();

  return { label: content, prIds, commits: [] };
};
