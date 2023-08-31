import { menuData } from '@/_generated/menu.mjs';
import { IFrontmatterData } from '@/types';
import { IMenuData } from '@/types/Layout';
import { createSlug } from '@/utils';
import type { StreamMetaData } from '@7-docs/edge';

interface IQueryResult extends StreamMetaData {
  content?: string;
  description?: string;
}

export const filePathToRoute = (filename?: string, header?: string): string => {
  if (!filename) return '';
  // Remove "src/pages" from the start of the filename
  let route = filename.replace(/^src\/pages/, '');

  // Remove file extension from the filename
  route = route.replace(/\.(md|mdx|tsx)$/, '');

  // If the filename ends with "index.*", remove that from the URL
  route = route.replace(/\/index$/, '');

  // Add a leading "/" if it's missing
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }

  if (header) {
    route = `${route}#${createSlug(header)}`;
  }

  return route;
};

const getData = (file: string): IFrontmatterData => {
  const tree = menuData as IMenuData[];

  let foundItem: IMenuData;
  const findPage = (tree: IMenuData[], file: string): IMenuData | undefined => {
    tree.forEach((item) => {
      if (item.root === file) {
        foundItem = item;
      } else {
        return findPage(item.children, file);
      }
    });

    return foundItem;
  };

  const item = findPage(tree, file);
  if (item !== undefined) {
    return {
      title: item.title,
      description: item.description,
    };
  }

  return {};
};

const cleanUpContent = (content: string): string | undefined => {
  // Regular expression to match the first-level heading (e.g., "# Title")
  const headingRegex = /#\s+(.*)(\n|$)/m;

  // Find the first match using the regular expression
  const match = content.match(headingRegex);

  // If a match is found, return the title (group 1 of the match)
  if (match && match.length >= 2) {
    return match[1];
  }

  // If no match is found, return null
  return;
};

export const mapMatches = (metadata: StreamMetaData): IQueryResult => {
  const content =
    typeof metadata.content !== 'undefined'
      ? cleanUpContent(metadata.content)
      : undefined;
  const data =
    typeof metadata.filePath !== 'undefined'
      ? getData(filePathToRoute(metadata.filePath, metadata.header))
      : {};

  return {
    ...metadata,
    content,
    ...data,
  };
};
