import type { IScriptResult } from '@kadena/docs-tools';
import fs from 'fs';
import type {
  Alternative,
  Content,
  Definition,
  Heading,
  Image,
  ImageReference,
  Link,
  LinkReference,
  Literal,
  Node,
  Paragraph,
  Parent,
  Resource,
  Text,
} from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { clone, removeRepoDomain } from '../importReadme';
import { getTypes, hasValue, isParent } from '../utils';
import { TEMP_DIR } from '../utils/build';

const errors: string[] = [];
const success: string[] = [];

interface IRepo {
  name: string;
  repo: string;
  directory: string;
  fileName: string;
}

interface IChangelogRecord {
  label: string;
  commit?: string;
  prId?: string;
}

interface IChanglogContent {
  label: string;
  patch: IChangelogRecord[];
  minor: IChangelogRecord[];
}

interface IChangelog extends IRepo {
  content: IChanglogContent[];
}

enum VersionPosition {
  PACKAGE = 0,
  VERSION = 1,
  PATCH = 2,
  MINOR = 3,
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

const getChangelog = (repo: IRepo): string => {
  return fs.readFileSync(
    `${TEMP_DIR}${removeRepoDomain(repo.repo)}${repo.directory}/${repo.fileName}`,
    'utf-8',
  );
};

const createVersion = (branch: Node): IChanglogContent => {
  return {
    label: hasValue(branch) ? (branch.children[0] as Text).value : '',
    patch: [],
    minor: [],
  };
};

const crawlContent = (tree: Node): string => {
  let content = '';

  const innerCrawl = (tree: Node): string => {
    tree.children?.forEach((branch) => {
      if (branch.value) {
        content = `${content}${branch.value}`;
        return content;
      }
      return innerCrawl(branch);
    });
  };

  innerCrawl(tree);

  return content;
};

const createRecord = (content: Node): IChangelogRecord => {
  const contentString = crawlContent(content);

  const regex = /\b[0-9a-f]{7,9}\b/;
  const match = contentString.match(regex);

  if (match) {
    const newContent = contentString
      .replace(match[0], '')
      .replace('[]', '')
      .replace('()', '')
      .replace(/^\:/, '')
      .trim();

    const [hash] = match;
    return { commit: hash, label: newContent };
  }

  return { label: contentString };
};

//create a json
const crawl = (
  repo: IRepo,
): ((tree: Node, position?: VersionPosition) => IChangelog) => {
  const content: IChanglogContent[] = [];
  let currentPosition: VersionPosition;

  const innerCrawl = (tree: Node, position?: VersionPosition): IChangelog => {
    if (isParent(tree)) {
      tree.children.forEach((branch) => {
        if (branch.type === 'heading' && branch.depth === 2) {
          content.push(createVersion(branch));
          currentPosition = VersionPosition.VERSION;
        }

        if (branch.type === 'heading' && branch.depth === 3) {
          if (
            branch.children[0].value === 'Patch Changes' ||
            branch.children[0].value === 'Bugfixes'
          ) {
            currentPosition = VersionPosition.PATCH;
          }
          if (branch.children[0].value === 'Minor Changes') {
            currentPosition = VersionPosition.MINOR;
          }
        }

        if (branch.type === 'listItem') {
          const record = createRecord(branch);

          switch (currentPosition) {
            case VersionPosition.MINOR:
              content[content.length - 1].minor.push(record);
              break;
            case VersionPosition.PATCH:
              content[content.length - 1].patch.push(record);
              break;
          }
        }

        innerCrawl(branch, currentPosition);
      });
    }

    return { ...repo, content };
  };

  return innerCrawl;
};

const createContent = (repo: IRepo) => {
  const md: Root = remark.parse(getChangelog(repo));

  return crawl(repo)(md);
};

const getContent = async (repos: IRepo[]): Promise<any> => {
  const promises = repos.map(createContent);

  const results = await Promise.allSettled(promises);

  const content: any[] = [];
  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      errors.push(`${repos[idx].repo} had issues with creating content`);
    } else {
      content.push(result.value);
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

  console.log(111, content[0].content[content[0].content.length - 1]);

  if (!errors.length) {
    success.push('Changelogs imported');
  }

  return { success, errors };
};

importChangelogs();
