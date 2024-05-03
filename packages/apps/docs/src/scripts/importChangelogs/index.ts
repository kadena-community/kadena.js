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
  Parent,
  Resource,
} from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { clone, removeRepoDomain } from '../importReadme';
import { getTypes, isParent } from '../utils';
import { TEMP_DIR } from '../utils/build';

const errors: string[] = [];
const success: string[] = [];

interface IRepo {
  name: string;
  repo: string;
  directory: string;
  fileName: string;
}

const REPOS: IRepo[] = [
  {
    name: 'React UI',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/libs/react-ui',
    fileName: 'CHANGELOG.md',
  },
];

const getChangelog = (repo: IRepo): string => {
  return fs.readFileSync(
    `${TEMP_DIR}${removeRepoDomain(repo.repo)}${repo.directory}/${repo.fileName}`,
    'utf-8',
  );
};

const createContent = (repo: IRepo) => {
  const md: Root = remark.parse(getChangelog(repo));

  const content = [];

  //create a json
  const crawl = <T>(tree: Node): T[] => {
    if (isParent(tree)) {
      tree.children.forEach((branch) => {
        if (branch.type === type) {
          arr.push(branch as unknown as T);
        }
        crawl(branch, type, arr);
      });
    }
    return arr;
  };

  crawl(md);

  //loop through the complete thing
  //## is the start of version
  //### patch/minor

  return content;
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

  if (!errors.length) {
    success.push('Changelogs imported');
  }

  errors.map(console.log);
  return { success, errors };
};

importChangelogs();
