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

export const reduceCommitDataCommit = (
  commit: IGHCommitDataCommit,
): IGHCommitDataCommitReduced => {
  try {
    const reduced: IGHCommitDataCommitReduced = {
      sha: commit.sha,
      url: commit.url,
      author: commit.author
        ? reduceUserData(commit.author)
        : commit.committer
          ? reduceUserData(commit.committer)
          : { login: commit.commit.author },
      comments_url: commit.comments_url,
      commit: {
        message: commit.commit.message,
        comment_count: commit.commit.comment_count,
      },
    };

    return reduced;
  } catch (e) {
    console.log(commit);
  }
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
