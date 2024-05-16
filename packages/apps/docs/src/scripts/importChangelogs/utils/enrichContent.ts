import { isAfter } from 'date-fns';
import { getVersionCommits } from './commits';
import { getLibraries, getVersions, writeContent } from './misc';
import { getVersionPRs } from './prs';

const getAuthors = (version: IChanglogContent): IGHUserReduced[] => {
  if (version.authors.length) return version.authors;

  const commitAuhtors = getVersionCommits(version).reduce(
    (acc: IGHUserReduced[], val: IGHCommit): IGHUserReduced[] => {
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
        acc: IGHUserReduced[],
        val: IGHCommitDataCommitReduced,
      ): IGHUserReduced[] => {
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

const getLastModifiedDate = (version: IChanglogContent): Date | undefined => {
  if (version.date) return version.date;

  const commitsDate = getVersionCommits(version).reduce(
    (acc: Date | undefined, val: IGHCommit): Date | undefined => {
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
    (acc: Date | undefined, val: IGHPR): Date | undefined => {
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
  getLibraries(content).forEach((library) => {
    getVersions(library).forEach((version) => {
      if (version.isLocked) return;
      version.date = getLastModifiedDate(version);
      version.authors = getAuthors(version);

      version.isLocked = true;
    });
  });

  writeContent(content);
};
