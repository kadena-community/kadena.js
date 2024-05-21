export const reduceHeaderData = (header: IGitHubHeader): IChangelogHeader => {
  const reduced: IChangelogHeader = {
    'last-modified': header['last-modified'],
    date: header.date,
  };

  return reduced;
};
export const reduceUserData = (user: IGitHubUser): IChangelogUser => {
  const reduced: IChangelogUser = {
    login: user.login,
    id: user.id,
    avatar_url: user.avatar_url,
    html_url: user.html_url,
    url: user.url,
  };

  return reduced;
};

export const getAuthor = (
  commit: IGithubCommitDataCommit,
): IChangelogUser | undefined => {
  if (commit.author) return reduceUserData(commit.author);
  if (commit.committer) return reduceUserData(commit.committer);
  if (commit.commit?.author) {
    return { login: commit.commit.author.name };
  }
  if (commit.commit?.committer) {
    return { login: commit.commit.committer.name };
  }
};

export const reduceCommitDataCommit = (
  commit: IGithubCommitDataCommit,
): IChangelogCommitDataCommit => {
  const reduced: IChangelogCommitDataCommit = {
    sha: commit.sha,
    url: commit.url,
    author: getAuthor(commit),
    comments_url: commit.comments_url,
    commit: {
      message: commit.commit?.message,
      comment_count: commit.commit?.comment_count ?? 0,
    },
  };

  return reduced;
};

export const reduceCommitData = (
  commit: IGitHubCommitData,
): IChangelogCommitData => {
  const reduced: IChangelogCommitData = {
    status: commit.status,
    headers: reduceHeaderData(commit.headers),
    data: reduceCommitDataCommit(commit.data),
  };

  return reduced;
};

export const reducePRData = (pr: IGitHubPRData): IChangelogPRData => {
  const reduced: IChangelogPRData = {
    url: pr.url,
    headers: reduceHeaderData(pr.headers),
    data: {
      title: pr.data.title,
      html_url: pr.data.html_url,
      user: reduceUserData(pr.data.user),
      body: pr.data.body,
    },
  };

  return reduced;
};
