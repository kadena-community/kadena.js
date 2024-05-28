import { Octokit } from 'octokit';
import {
  reduceCommitData,
  reduceCommitDataCommit,
  reducePRData,
} from './utils/reduce';

const octokit = new Octokit({
  auth: process.env.GITHUB_APITOKEN,
});

export const getCommitData = async (
  pkg: IChangelogPackage,
  commit: IChangelogCommit,
): Promise<void> => {
  try {
    commit.tries = commit.tries + 1;

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}',
      {
        owner: pkg.owner,
        repo: pkg.repoName,
        commit_sha: commit.hash,
      },
    );

    // eslint-disable-next-line require-atomic-updates
    commit.data = reduceCommitData(data as unknown as IGitHubCommitData);
  } catch (e) {
    console.log({ e });
  }
};

export const getPRCommitData = async (
  pkg: IChangelogPackage,
  pr: IChangelogPR,
): Promise<IChangelogCommitDataCommit[]> => {
  const data = (await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/commits',
    {
      owner: pkg.owner,
      repo: pkg.repoName,
      pull_number: pr.id,
    },
  )) as any;

  const reducedData = (data.data as IGithubCommitDataCommit[]).map(
    reduceCommitDataCommit,
  );

  return reducedData;
};

export const getPRData = async (
  pkg: IChangelogPackage,
  pr: IChangelogPR,
): Promise<void> => {
  try {
    pr.tries = pr.tries + 1;

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}',
      {
        owner: pkg.owner,
        repo: pkg.repoName,
        pull_number: pr.id,
      },
    );

    const commits = await getPRCommitData(pkg, pr);

    // eslint-disable-next-line require-atomic-updates
    pr.data = reducePRData(data as unknown as IGitHubPRData);
    // eslint-disable-next-line require-atomic-updates
    pr.commits = commits;
  } catch (e) {
    console.log({ e });
  }
};
