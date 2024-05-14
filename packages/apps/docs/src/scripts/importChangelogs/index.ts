import type { IScriptResult } from '@kadena/docs-tools';
import fs from 'fs';
import type { Node, Text } from 'mdast';
import { Octokit } from 'octokit';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { clone, removeRepoDomain } from '../importReadme';
import { isParent } from '../utils';
import { TEMP_DIR } from '../utils/build';

const errors: string[] = [];
const success: string[] = [];
const CHANGELOGFILENAME = './src/data/changelogs.json';
const MAX_TRIES = 3;
const MAXCALLS = 3;

const octokit = new Octokit({
  auth: process.env.GITHUB_APITOKEN,
});

enum VersionPosition {
  PACKAGE = 0,
  VERSION = 1,
  PATCH = 2,
  MINOR = 3,
  MISC = 4,
}

// TODO: we should add this to the config.yaml
const REPOS: IRepo[] = [
  // {
  //   name: 'React UI',
  //   repo: 'https://github.com/kadena-community/kadena.js.git',
  //   directory: '/packages/libs/react-ui',
  //   fileName: 'CHANGELOG.md',
  //   owner: 'kadena-community',
  //   repoName: 'kadena.js',
  // },
  // {
  //   name: 'KadenaJS',
  //   repo: 'https://github.com/kadena-community/kadena.js.git',
  //   directory: '/packages/libs/kadena.js',
  //   fileName: 'CHANGELOG.md',
  //   owner: 'kadena-community',
  //   repoName: 'kadena.js',
  // },
  {
    name: 'Pact 4',
    repo: 'https://github.com/kadena-io/pact.git',
    directory: '/',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-io',
    repoName: 'pact',
  },
];

const getPrs = (library: IChangelog): IGHPR[] => {
  return Object.entries(library.content)
    .map(([key, version]) => {
      const patchCommits =
        version.patches.map((val) => {
          return val.prIds;
        }) ?? [];
      const minorCommits =
        version.minors.map((val) => {
          return val.prIds;
        }) ?? [];
      const miscCommits =
        version.miscs.map((val) => {
          return val.prIds;
        }) ?? [];

      return [...miscCommits, ...patchCommits, ...minorCommits];
    })
    .flat()
    .flat();
};

const getCommits = (library: IChangelog): IGHCommit[] => {
  return Object.entries(library.content)
    .map(([key, version]) => {
      const patchCommits =
        version.patches.map((val) => {
          return val.commits;
        }) ?? [];
      const minorCommits =
        version.minors.map((val) => {
          return val.commits;
        }) ?? [];
      const miscCommits =
        version.miscs.map((val) => {
          return val.commits;
        }) ?? [];

      return [...miscCommits, ...patchCommits, ...minorCommits];
    })
    .flat()
    .flat();
};

const getPRData = async (library: IChangelog, pr: IGHPR): Promise<void> => {
  try {
    pr.tries = pr.tries + 1;

    const data = await octokit.request(
      'GET /repos/{owner}/{repo}/pull/{pull_number}',
      {
        owner: library.owner,
        repo: library.repoName,
        pull_number: pr.id,
      },
    );

    console.log({ data });

    if (data.status === 200) {
      // eslint-disable-next-line require-atomic-updates
      pr.data = data as IGHCommitData;
    }
  } catch (e) {
    console.log({ e });
  }
};

const getCommitData = async (
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
    if (data.status === 200) {
      // eslint-disable-next-line require-atomic-updates
      commit.data = data as IGHCommitData;
    }
  } catch (e) {
    console.log({ e });
  }
};

const writeContent = (content: IChangelogComplete): void => {
  fs.writeFileSync(CHANGELOGFILENAME, JSON.stringify(content, null, 2));
};

const filterPRsWithoutData = (pr: IGHPR): boolean =>
  pr.tries < MAX_TRIES && !pr.data;

const filterCommitsWithoutData = (commit: IGHCommit): boolean =>
  commit.tries < MAX_TRIES && !commit.data;

const getGitHubData = async (content: IChangelogComplete): Promise<void> => {
  const libraries = Object.entries(content);
  for (let i = 0; i < libraries.length; i++) {
    const [, library] = libraries[i];
    const commits = getCommits(library)
      .filter(filterCommitsWithoutData)
      .slice(0, MAXCALLS); // TODO: remove the slice

    const prs = getPrs(library).filter(filterPRsWithoutData).slice(0, MAXCALLS); // TODO: remove the slice

    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];

      await getCommitData(library, commit);
      writeContent(content);
    }

    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];

      await getPRData(library, pr);
      writeContent(content);
    }
  }
};

const getCurrentContentCreator = () => {
  let content: IChangelogComplete;

  return (): IChangelogComplete => {
    if (content) return content;
    const result = fs.readFileSync(CHANGELOGFILENAME, 'utf-8');
    content = JSON.parse(result.trim());
    return content;
  };
};

const getCurrentContent = getCurrentContentCreator();

const getChangelog = (repo: IRepo): string => {
  return fs.readFileSync(
    `${TEMP_DIR}${removeRepoDomain(repo.repo)}${repo.directory}/${repo.fileName}`,
    'utf-8',
  );
};

//TESTABLE
const createVersion = (branch: Node): IChanglogContent => {
  return {
    label: (branch as any).children[0].value ?? '',
    patches: [],
    minors: [],
    miscs: [],
  };
};

const crawlContent = (tree: Node): string => {
  let content = '';

  const innerCrawl = (tree: Node): string => {
    if (isParent(tree)) {
      tree.children?.forEach((branch) => {
        const text = (branch as Text).value;
        if (text) {
          content = `${content}${text}`;
          return content;
        }
        return innerCrawl(branch);
      });
    }
    return content;
  };

  innerCrawl(tree);

  return content;
};

//TESTABLE
const getCommitId = (content: string): IChangelogRecord => {
  const regex = /\b[0-9a-f]{7,10}\b/;
  const match = content.match(regex);

  if (match) {
    const newContent = content
      .replace(match[0], '')
      .replace('[]', '')
      .replace('()', '')
      .replace(/^\:/, '')
      .trim();

    const [hash] = match;
    return {
      commits: [
        {
          hash,
          tries: 0,
        },
      ],
      label: newContent,
      prIds: [],
    };
  }

  return { label: content, commits: [], prIds: [] };
};

//TESTABLE
const getPrId = (content: string): IChangelogRecord => {
  const regex = /#(\d+)/g;
  const prIds: IGHPR[] = [];
  const matches = content.match(regex);

  matches?.forEach((match: string, idx: number) => {
    content = content.replace(match, '');
    prIds.push({ id: match.substring(1), tries: 0 });
  });

  content = content
    .replace('[]', '')
    .replace(/\(?[, ]*\)/g, '')
    .replace(/^\:/, '')
    .trim();

  return { label: content, prIds, commits: [] };
};

const createRecord = (content: Node): IChangelogRecord => {
  const contentString = crawlContent(content);

  const { commits, label: tempLabel } = getCommitId(contentString);
  const { prIds, label } = getPrId(tempLabel);

  return {
    label,
    commits,
    prIds,
  };
};

//create a json
const crawl = (repo: IRepo): ((tree: Node) => IChangelog) => {
  const content: Record<string, IChanglogContent> = {};
  let currentPosition: VersionPosition;
  let version: IChanglogContent | undefined;
  const currentContent = getCurrentContent();

  const innerCrawl = (tree: Node): IChangelog => {
    if (isParent(tree)) {
      tree.children.forEach((branch, idx) => {
        if (branch.type === 'heading' && branch.depth === 2) {
          version = createVersion(branch);
          if (!currentContent[repo.name]?.content[version.label]) {
            content[version.label] = version;
            currentPosition = VersionPosition.VERSION;
          } else {
            content[version.label] =
              currentContent[repo.name].content[version.label];
            version = undefined;
          }
        }

        if (branch.type === 'heading' && branch.depth === 3) {
          const value = (branch.children[0] as Text).value;
          switch (true) {
            case value === 'Patch Changes' || value === 'Bugfixes':
              currentPosition = VersionPosition.PATCH;
              break;
            case value === 'Minor Changes':
              currentPosition = VersionPosition.MINOR;
              break;
            default:
              currentPosition = VersionPosition.MISC;
              break;
          }
        }

        if (branch.type === 'listItem' && version) {
          const record = createRecord(branch);

          switch (currentPosition) {
            case VersionPosition.MINOR:
              content[version.label].minors.push(record);
              break;
            case VersionPosition.PATCH:
              content[version.label].patches.push(record);
              break;
            default:
              content[version.label].miscs.push(record);
              break;
          }
        } else {
          innerCrawl(branch);
        }
      });
    }

    return { ...repo, content };
  };

  return innerCrawl;
};

const createContent = async (repo: IRepo) => {
  const md: Root = remark.parse(getChangelog(repo));

  const repoCrawler = await crawl(repo);
  return await repoCrawler(md);
};

const getContent = async (repos: IRepo[]): Promise<IChangelogComplete> => {
  const promises = repos.map(createContent);

  const results = await Promise.allSettled(promises);

  const content: IChangelogComplete = {};
  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      errors.push(`${repos[idx].repo} had issues with creating content`);
    } else {
      content[result.value.name] = result.value;
    }
  });

  return content;
};

const getRepos = async (repos: IRepo[]): Promise<void> => {
  const promises = repos.map((repo) => {
    return clone(repo.repo);
  });

  const results = await Promise.allSettled(promises);

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      errors.push(`${repos[idx].repo} had issues with cloning`);
    }
  });
};

export const importChangelogs = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  await getRepos(REPOS);
  const content = await getContent(REPOS);

  await getGitHubData(content);

  if (!errors.length) {
    writeContent(content);
    success.push('Changelogs imported');
  }

  console.log({ errors });
  return { success, errors };
};

importChangelogs();
