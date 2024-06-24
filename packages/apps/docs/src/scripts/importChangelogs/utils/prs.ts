import { MAX_TRIES } from '../constants';
import { getVersions } from './misc';

export const filterPRsWithoutData = (pr: IChangelogPR): boolean =>
  pr.tries < MAX_TRIES && !pr.data;

// returns an array of all prs of a version
export const getVersionPRs = (
  version: IChangelogPackageVersion,
): IChangelogPR[] => {
  const patchPrs =
    version.patches.map((val) => {
      return val.prIds;
    }) ?? [];
  const minorPrs =
    version.minors.map((val) => {
      return val.prIds;
    }) ?? [];
  const miscPrs =
    version.miscs.map((val) => {
      return val.prIds;
    }) ?? [];

  return [...miscPrs, ...patchPrs, ...minorPrs].flat().flat();
};

// returns all the prs for a certain package
export const getPrs = (pkg: IChangelogPackage): IChangelogPR[] => {
  return getVersions(pkg).map(getVersionPRs).flat().flat();
};

/**
 * this will check the content string for PR IDs
 * and return an object with an array of ids (there can be more ids in content)
 * the label will be the content without the id
 * there is a tries property set to 0.
 * the tries is the amount of re-tries that can be done for getting the data of that pr data from github
 * after 3 tries we can presume that the github api does not return data for this pr, for what ever reason
 */
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
    .replace(/\[``\]\(\S*/, '')
    .trim();

  return { label: content, prIds, commits: [] };
};
