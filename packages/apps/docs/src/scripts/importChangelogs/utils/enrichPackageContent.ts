import { isAfter } from 'date-fns';
import { getVersionCommits } from './commits';
import { getPackages, getVersions, writeContent } from './misc';
import { getVersionPRs } from './prs';

/**
 * get all author data from a version and return them as an array
 */
export const getAuthors = (
  version: IChangelogPackageVersion,
): IChangelogUser[] => {
  if (version.authors.length) return version.authors;

  const commitAuhtors = getVersionCommits(version).reduce(
    (acc: IChangelogUser[], val: IChangelogCommit): IChangelogUser[] => {
      if (!val?.data?.data?.author) return acc;
      const author = val.data.data.author;
      if (acc.find((v) => v.id === author.id)) return acc;

      acc.push(author);
      return acc;
    },
    [],
  );

  const prAuhtors = getVersionPRs(version)
    .map((pr) => pr.commits)
    .flat()
    .reduce(
      (
        acc: IChangelogUser[],
        val: IChangelogCommitDataCommit,
      ): IChangelogUser[] => {
        if (!val.author) return acc;
        const author = val.author;
        if (acc.find((v) => v.id === author.id)) return acc;

        acc.push(author);
        return acc;
      },
      [],
    );

  return [...commitAuhtors, ...prAuhtors];
};

/**
 * get the newest date from the version commits and return;
 * this will be the last date that the version was modified.
 * as we have no actual date when the version was released, this is the closest we get
 */
export const getLastModifiedDate = (
  version: IChangelogPackageVersion,
): Date | undefined => {
  if (version.date) return version.date;

  const commitsDate = getVersionCommits(version).reduce(
    (acc: Date | undefined, val: IChangelogCommit): Date | undefined => {
      const lastModifiedDate = val.data?.headers['last-modified']
        ? new Date(val.data?.headers['last-modified'])
        : undefined;

      if ((acc && lastModifiedDate && isAfter(lastModifiedDate, acc)) || !acc) {
        return lastModifiedDate;
      }

      return acc;
    },
    undefined,
  );

  const prsDate = getVersionPRs(version).reduce(
    (acc: Date | undefined, val: IChangelogPR): Date | undefined => {
      const lastModifiedDate = val.data?.headers['last-modified']
        ? new Date(val.data?.headers['last-modified'])
        : undefined;

      if ((acc && lastModifiedDate && isAfter(lastModifiedDate, acc)) || !acc) {
        return lastModifiedDate;
      }

      return acc;
    },
    undefined,
  );

  if (!prsDate) return commitsDate;
  if (!commitsDate) return prsDate;

  return prsDate > commitsDate ? prsDate : commitsDate;
};

/**
 * this will go through all versions and get some data from all its commits and PRs
 * and store that data for more easy access.
 * This way we dont have to go through all commits and PRs in the frontend.
 */
export const enrichPackageContent = (content: IChangelogComplete) => {
  getPackages(content).forEach((pkg) => {
    getVersions(pkg).forEach((version) => {
      if (version.isLocked) return;
      version.date = getLastModifiedDate(version);
      version.authors = getAuthors(version);

      version.isLocked = true;
    });
  });

  writeContent(content);
};
