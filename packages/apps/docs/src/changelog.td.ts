interface IRepo {
  name: string;
  repo: string;
  directory: string;
  fileName: string;
  owner: string;
  repoName: string;
}

interface IGHUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface IGHFile {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch: string;
}
interface IGHCommitData {
  status: number;
  url: string;
  headers: {
    'access-control-allow-origin': string;
    'access-control-expose-headers': string;
    'cache-control': string;
    'content-encoding': string;
    'content-security-policy': string;
    'content-type': 'application/json; charset=utf-8';
    date: string;
    etag: string;
    'github-authentication-token-expiration': string;
    'last-modified': string;
    'referrer-policy': string;
    server: 'GitHub.com';
    'strict-transport-security': string;
    'transfer-encoding': string;
    vary: string;
    'x-accepted-oauth-scopes': string;
    'x-content-type-options': string;
    'x-frame-options': string;
    'x-github-api-version-selected': '2022-11-28';
    'x-github-media-type': 'github.v3; format=json';
    'x-github-request-id': string;
    'x-oauth-scopes': string;
    'x-ratelimit-limit': string;
    'x-ratelimit-remaining': string;
    'x-ratelimit-reset': string;
    'x-ratelimit-resource': string;
    'x-ratelimit-used': string;
    'x-xss-protection': string;
  };
  data: {
    sha: string;
    node_id: string;
    commit: {
      author: {
        name: string;
        email: string;
        date: string;
      };
      committer: {
        name: string;
        email: string;
        date: string;
      };
      message: string;
      tree: {
        sha: string;
        url: string;
      };
      url: string;
      comment_count: number;
      verification: {
        verified: boolean;
        reason: string;
        signature: null | string;
        payload: null | string;
      };
    };
    url: string;
    html_url: string;
    comments_url: string;
    author: IGHUser;
    committer: IGHUser;
    parents: [
      {
        sha: string;
        url: string;
        html_url: string;
      },
    ];
    stats: {
      total: number;
      additions: number;
      deletions: number;
    };
    files: IGHFile[];
  };
}

interface IGHPRData {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: IGHUser;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at: string;
  merge_commit_sha: string;
  assignee: null | IGHUser;
  assignees: IGHUser[];
  requested_reviewers: IGHUser[];
  labels: string[];
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  author_association: string;
  auto_merge: null | string;
  active_lock_reason: null | string;
  merged: boolean;
  mergeable: null;
  rebaseable: null;
  mergeable_state: 'unknown';
  merged_by: IGHUser[];
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

interface IGHPR {
  id: number;
  tries: number; //the amount of tries to get the data
  data?: IGHPRData;
}

interface IGHCommit {
  hash: string;
  tries: number; //the amount of tries to get the data
  data?: IGHCommitData;
}

interface IChangelogRecord {
  label: string;
  commits: IGHCommit[];
  prIds: IGHPR[];
}

interface IChanglogContent {
  label: string;
  date?: Date;
  patches: IChangelogRecord[];
  minors: IChangelogRecord[];
  miscs: IChangelogRecord[];
}

interface IChangelog extends IRepo {
  content: Record<string, IChanglogContent>;
}

type IChangelogComplete = Record<string, IChangelog>;
