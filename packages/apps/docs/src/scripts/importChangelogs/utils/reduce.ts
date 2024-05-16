export const reduceHeaderData = (header: IGHHeader): IGHHeaderReduced => {
  const reduced: IGHHeaderReduced = {
    'last-modified': header['last-modified'],
    date: header.date,
  };

  return reduced;
};
export const reduceUserData = (user: IGHUser): IGHUserReduced => {
  const reduced: IGHUserReduced = {
    login: user.login,
    id: user.id,
    avatar_url: user.avatar_url,
    url: user.url,
  };

  return reduced;
};

export const getAuthor = (
  commit: IGHCommitDataCommit,
): IGHUserReduced | undefined => {
  if (commit.author) return reduceUserData(commit.author);
  if (commit.committer) return reduceUserData(commit.committer);
  if (commit.commit.author) {
    return { login: commit.commit.author } as unknown as IGHUserReduced;
  }
  if (commit.commit.committer) {
    return { login: commit.commit.committer } as unknown as IGHUserReduced;
  }
};

export const reduceCommitDataCommit = (
  commit: IGHCommitDataCommit,
): IGHCommitDataCommitReduced => {
  const reduced: IGHCommitDataCommitReduced = {
    sha: commit.sha,
    url: commit.url,
    author: getAuthor(commit),
    comments_url: commit.comments_url,
    commit: {
      message: commit.commit.message,
      comment_count: commit.commit.comment_count,
    },
  };

  return reduced;
};

export const reduceCommitData = (
  commit: IGHCommitData,
): IGHCommitDataReduced => {
  const reduced: IGHCommitDataReduced = {
    status: commit.status,
    headers: reduceHeaderData(commit.headers),
    data: reduceCommitDataCommit(commit.data),
  };

  return reduced;
};

export const reducePRData = (pr: IGHPRData): IGHPRDataReduced => {
  const reduced: IGHPRDataReduced = {
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
