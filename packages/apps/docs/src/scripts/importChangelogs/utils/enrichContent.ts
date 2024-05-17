import { isAfter } from 'date-fns';
import { getVersionCommits } from './commits';
import { getPackages, getVersions, writeContent } from './misc';
import { getVersionPRs } from './prs';

const getAuthors = (version: IChangelogPackageVersion): IChangelogUser[] => {
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

const getLastModifiedDate = (
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

  const prssDate = getVersionPRs(version).reduce(
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

  if (!prssDate) return commitsDate;
  if (!commitsDate) return prssDate;

  return prssDate > commitsDate ? prssDate : commitsDate;
};

export const enrichContent = (content: IChangelogComplete) => {
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
