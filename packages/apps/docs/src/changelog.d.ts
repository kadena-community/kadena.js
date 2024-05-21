type IChangelogComplete = Record<string, IChangelogPackage>;

interface IRepo {
  name: string;
  repo: string;
  directory: string;
  fileName: string;
  owner: string;
  repoName: string;
}
interface IChangelogPackage extends IRepo {
  content: Record<string, IChangelogPackageVersion>;
}

interface IChangelogPackageVersion {
  label: string;
  isLocked: boolean;
  date?: Date;
  authors: IChangelogUser[];
  patches: IChangelogVersionRecord[];
  minors: IChangelogVersionRecord[];
  miscs: IChangelogVersionRecord[];
}

interface IChangelogVersionRecord {
  label: string;
  commits: IChangelogCommit[];
  prIds: IChangelogPR[];
}

type IChangelogUser = Pick<IGitHubUser, 'login'> &
  Partial<Pick<IGitHubUser, 'id' | 'avatar_url' | 'url' | 'html_url'>>;

type IChangelogHeader = Pick<IGitHubHeader, 'last-modified' | 'date'>;

type IChangelogPRData = Pick<IGitHubPRData, 'url'> & {
  headers: IChangelogHeader;
  data: { title: string; html_url: string; user: IChangelogUser; body: string };
};

interface IChangelogPR {
  id: number;
  tries: number; //the amount of tries to get the data
  commits: IChangelogCommitDataCommit[];
  data?: IChangelogPRData;
}

interface IChangelogCommit {
  hash: string;
  tries: number; //the amount of tries to get the data
  data?: IChangelogCommitData;
}

type IChangelogCommitData = Pick<IGitHubCommitData, 'status'> & {
  headers: IChangelogHeader;
  data: IChangelogCommitDataCommit;
};

type IChangelogCommitDataCommit = Pick<
  IGithubCommitDataCommit,
  'sha' | 'url' | 'comments_url' | 'html_url'
> & {
  author?: IChangelogUser;
  commit: {
    message: string;
    comment_count: number;
  };
};
