import type { IScriptResult } from '@kadena/docs-tools';
import fs from 'fs';
import type { Node, Text } from 'mdast';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { clone } from '../importReadme';
import { deleteTempDir } from '../importReadme/importRepo';
import { runPrettier } from '../runPrettier';
import { isParent } from '../utils';
import {
  CHANGELOGFILENAME,
  REPOS,
  VersionPosition,
  errors,
  success,
} from './constants';
import { getCommitId } from './utils/commits';
import { enrichContent } from './utils/enrichContent';
import { getGitHubData } from './utils/github';
import { getChangelog, writeContent } from './utils/misc';
import { getPrId } from './utils/prs';

const getCurrentContentCreator = () => {
  let content: IChangelogComplete;

  return (): IChangelogComplete => {
    if (content) return content;
    const result = fs.readFileSync(CHANGELOGFILENAME, 'utf-8');
    content = JSON.parse(result.trim());
    return content ?? {};
  };
};

const getCurrentContent = getCurrentContentCreator();

//TESTABLE
const createVersion = (branch: Node): IChanglogContent => {
  return {
    label: (branch as any).children[0].value ?? '',
    isLocked: false,
    authors: [],
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

const checkPatchNames = (value: string): boolean => {
  const names = ['patch changes', 'bugfixes', 'tests'];

  return names.includes(value.toLowerCase());
};
const checkMinorNames = (value: string): boolean => {
  const names = ['minor changes', 'features'];

  return names.includes(value.toLowerCase());
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
          if (!currentContent[repo.name]?.content[version.label].isLocked) {
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
            case checkPatchNames(value):
              currentPosition = VersionPosition.PATCH;
              break;
            case checkMinorNames(value):
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

  const content: IChangelogComplete = getCurrentContent();

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
  enrichContent(content);

  if (!errors.length) {
    writeContent(content);
    success.push('Changelogs imported');
  }

  await runPrettier();
  console.log({ errors });

  deleteTempDir();

  return { success, errors };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
importChangelogs();
