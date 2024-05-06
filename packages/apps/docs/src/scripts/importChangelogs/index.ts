import type { IScriptResult } from '@kadena/docs-tools';
import fs from 'fs';
import type { Node, Text } from 'mdast';
import { App, Octokit } from 'octokit';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { clone, removeRepoDomain } from '../importReadme';
import { isParent } from '../utils';
import { TEMP_DIR } from '../utils/build';

const errors: string[] = [];
const success: string[] = [];
const CHANGELOGFILENAME = './src/changelogs.json';

const octokit = new Octokit({});

interface IRepo {
  name: string;
  repo: string;
  directory: string;
  fileName: string;
}

interface IChangelogRecord {
  label: string;
  commits?: string[];
  prIds?: string[];
}

interface IChanglogContent {
  label: string;
  patch: IChangelogRecord[];
  minor: IChangelogRecord[];
  misc: IChangelogRecord[];
}

interface IChangelog extends IRepo {
  content: Record<string, IChanglogContent>;
}

type IChangelogComplete = Record<string, IChangelog>;

enum VersionPosition {
  PACKAGE = 0,
  VERSION = 1,
  PATCH = 2,
  MINOR = 3,
  MISC = 4,
}

// TODO: we should add this to the config.yaml
const REPOS: IRepo[] = [
  {
    name: 'React UI',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/libs/react-ui',
    fileName: 'CHANGELOG.md',
  },
  // {
  //   name: 'KadenaJS',
  //   repo: 'https://github.com/kadena-community/kadena.js.git',
  //   directory: '/packages/libs/kadena.js',
  //   fileName: 'CHANGELOG.md',
  // },
  // {
  //   name: 'Pact 4',
  //   repo: 'https://github.com/kadena-io/pact.git',
  //   directory: '/',
  //   fileName: 'CHANGELOG.md',
  // },
];

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
    patch: [],
    minor: [],
    misc: [],
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
    return { commits: [hash], label: newContent };
  }

  return { label: content };
};

//TESTABLE
const getPrId = (content: string): IChangelogRecord => {
  const regex = /#(\d+)/g;
  const prIds: string[] = [];
  const matches = content.match(regex);

  matches?.forEach((match: string, idx: number) => {
    content = content.replace(match, '');
    prIds.push(match.substring(1));
  });

  content = content
    .replace('[]', '')
    .replace(/\(?[, ]*\)/g, '')
    .replace(/^\:/, '')
    .trim();

  return { label: content, prIds };
};

const createRecord = async (content: Node): Promise<IChangelogRecord> => {
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
const crawl = (repo: IRepo): ((tree: Node) => Promise<IChangelog>) => {
  const content: Record<string, IChanglogContent> = {};
  let currentPosition: VersionPosition;
  let version: IChanglogContent | undefined;
  const currentContent = getCurrentContent();

  const innerCrawl = async (tree: Node): Promise<IChangelog> => {
    if (isParent(tree)) {
      tree.children.forEach(async (branch, idx) => {
        if (branch.type === 'heading' && branch.depth === 2) {
          version = createVersion(branch);
          //if (!currentContent[repo.name]?.content[version.label]) {
          content[version.label] = version;
          currentPosition = VersionPosition.VERSION;
          // } else {
          //   content[version.label] =
          //     currentContent[repo.name].content[version.label];
          //   version = undefined;
          // }
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
          const record = await createRecord(branch);

          switch (currentPosition) {
            case VersionPosition.MINOR:
              content[version.label].minor.push(record);
              break;
            case VersionPosition.PATCH:
              content[version.label].patch.push(record);
              break;
            default:
              content[version.label].misc.push(record);
              break;
          }
        } else {
          await innerCrawl(branch);
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

  // get data
  const data = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner: 'kadena-community',
    repo: 'kadena.js',
  });

  console.log(data);

  if (!errors.length) {
    fs.writeFileSync(CHANGELOGFILENAME, JSON.stringify(content, null, 2));
    success.push('Changelogs imported');
  }

  return { success, errors };
};

importChangelogs();
