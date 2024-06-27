import type { IScriptResult } from '@kadena/docs-tools';
import fs from 'fs';
import type { Node, Text } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
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
import { checkVersionPosition } from './utils/checkNames';
import { getChangelog, writeContent } from './utils/content';
import { createVersion } from './utils/createVersion';
import { createVersionRecord } from './utils/createVersionRecord';
import { enrichPackageContent } from './utils/enrichPackageContent';
import { getGitHubData } from './utils/github';

/**
 * Script that will check all the given packages their CHANGELOG file
 * It will import all the changelog lines and put them in 1 large JSON,
 * that we can use in the frontend to show the data
 * It will check for PR Ids and Commit hashes and put them in an array
 * For all hashes and PRIds it will try to collect extra data from github via the github API
 * and save that as well in the JSON
 *
 * The script will run and write the data after every time it has fetched an API call.
 * Once the github data is fetched and saved the version record will be locked, so that we don't have to
 * fetch that data everytime the script runs
 * This way we save time and we can go in and manually fix typos, without them being overwritten everytime we run the script
 */

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

//create a json
const crawl = (repo: IRepo): ((tree: Node) => IChangelogPackage) => {
  const content: Record<string, IChangelogPackageVersion> = {};
  let currentPosition: VersionPosition;
  let version: IChangelogPackageVersion | undefined;
  const currentContent = getCurrentContent();

  const innerCrawl = (tree: Node): IChangelogPackage => {
    if (isParent(tree)) {
      tree.children.forEach((branch, idx) => {
        if (branch.type === 'heading' && branch.depth === 2) {
          version = createVersion(branch);
          if (!currentContent[repo.slug]?.content[version.label]?.isLocked) {
            content[version.label] = version;
            currentPosition = VersionPosition.VERSION;
          } else {
            content[version.label] =
              currentContent[repo.slug].content[version.label];
            version = undefined;
          }
        } else if (branch.type === 'heading' && branch.depth === 3) {
          currentPosition = checkVersionPosition(
            (branch.children[0] as Text).value,
          );
        } else if (branch.type === 'listItem' && version) {
          const record = createVersionRecord(branch);

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
        } else if (currentPosition === VersionPosition.VERSION) {
          if (toMarkdown(branch as any) && version) {
            content[version.label].descriptionTemp?.children.push(
              branch as never,
            );
            content[version.label].description = toMarkdown(
              content[version.label].descriptionTemp as any,
            );
          }
        } else {
          innerCrawl(branch);
        }
      });
    }

    // remove the tempdescriptions from versions
    for (const key in content) {
      if ({}.hasOwnProperty.call(content, key)) {
        const version = content[key];
        delete version.descriptionTemp;
      }
    }

    return { ...repo, content };
  };

  return innerCrawl;
};

const createRepoContent = async (repo: IRepo) => {
  const md: Root = remark.parse(getChangelog(repo));

  const repoCrawler = await crawl(repo);
  return await repoCrawler(md);
};

const getReposContent = async (repos: IRepo[]): Promise<IChangelogComplete> => {
  const promises = repos.map(createRepoContent);

  const results = await Promise.allSettled(promises);

  const content: IChangelogComplete = getCurrentContent();

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      errors.push(`${repos[idx].repo} had issues with creating content`);
    } else {
      content[result.value.slug] = result.value;
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
  const content = await getReposContent(REPOS);

  await getGitHubData(content);
  enrichPackageContent(content);

  if (!errors.length) {
    writeContent(content);
    success.push('Changelogs imported');
  }

  await runPrettier();
  console.log({ errors });

  deleteTempDir();

  if (errors.length > 0) process.exitCode = 1;
  else process.exitCode = 0;

  return { success, errors };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
importChangelogs();
