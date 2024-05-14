import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_APITOKEN,
});

export const getCommitData = async (
  library: IChangelog,
  commit: IGHCommit,
): Promise<void> => {
  try {
    commit.tries = commit.tries + 1;

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}',
      {
        owner: library.owner,
        repo: library.repoName,
        commit_sha: commit.hash,
      },
    );

    // eslint-disable-next-line require-atomic-updates
    commit.data = data as IGHCommitData;
  } catch (e) {
    console.log({ e });
  }
};

export const getPRData = async (
  library: IChangelog,
  pr: IGHPR,
): Promise<void> => {
  try {
    pr.tries = pr.tries + 1;

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}',
      {
        owner: library.owner,
        repo: library.repoName,
        pull_number: pr.id,
      },
    );

    // eslint-disable-next-line require-atomic-updates
    pr.data = data as unknown as IGHPRData;
  } catch (e) {
    console.log({ e });
  }
};
