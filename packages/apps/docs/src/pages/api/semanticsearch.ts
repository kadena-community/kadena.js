import menuData from '@/_generated/menu.json';
import type { IFrontmatterData } from '@/types';
import { removeImageInfoFromMarkdown } from '@/utils/removeImageInfoFromMarkdown';
import type { StreamMetaData } from '@7-docs/edge';
import type { IMenuData } from '@kadena/docs-tools';
import { createSlug } from '@kadena/docs-tools';
import algoliasearch from 'algoliasearch';
import type { NextApiRequest, NextApiResponse } from 'next';

interface IQueryResult extends StreamMetaData {
  content?: string;
  description?: string;
}

const jsonFilePathMapper = [
  {
    srcFilePath: 'src/specs/pact/pact.openapi.json',
    generatedFilePath: 'src/pages/pact/api',
  },
  {
    srcFilePath: 'src/specs/chainweb/chainweb.openapi.json',
    generatedFilePath: 'src/pages/chainweb',
  },
];

export const filePathToRoute = (filename?: string, header?: string): string => {
  if (!filename) return '';
  // Remove "src/pages" from the start of the filename
  let route = filename.replace(/^src\/pages(\/docs)?/, '');

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
  const tree = menuData as unknown as IMenuData[];

  let foundItem: IMenuData;
  const findPage = (tree: IMenuData[], file: string): IMenuData | undefined => {
    if (!tree) return;
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
    return removeImageInfoFromMarkdown(match[1]);
  }

  // If no match is found, return null
  return;
};

export const mapMatches = (metadata: StreamMetaData): IQueryResult => {
  const content =
    typeof metadata.content !== 'undefined'
      ? cleanUpContent(metadata.content)
      : undefined;

  const isJSON = jsonFilePathMapper.find(
    (item) => item.srcFilePath === metadata.filePath,
  );

  metadata.filePath = isJSON ? isJSON.generatedFilePath : metadata.filePath;

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

interface ISemanticSearchQuery {
  search?: string;
  limit?: string;
}

interface ISemanticSearchRequest extends Omit<NextApiRequest, 'query'> {
  query?: ISemanticSearchQuery;
}

interface IHitResult extends StreamMetaData {
  _highlightResult?: {
    content?: {
      value?: string;
    };
  };
}

// E.g /api/semanticsearch?search=foo&limit=10
const semanticSearch = async (
  req: ISemanticSearchRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { query: { search = '', limit = '10' } = {} } = req;

  const limitNumber = parseInt(limit, 10);

  if (!search) {
    return res.status(200).json([]);
  }

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID ?? '',
    process.env.ALGOLIA_SEARCH_API_KEY ?? '',
  );

  const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME ?? '');
  const CONTENT_MAX_LENGTH = 320;

  index
    .search(search, { hitsPerPage: limitNumber })
    .then(({ hits }) => {
      const mappedData = hits.map((hit) => {
        const { filePath, title, content, url, header, _highlightResult } =
          hit as IHitResult;
        const highlightedContent = _highlightResult?.content?.value ?? content;
        const hasMoreContent =
          (highlightedContent || '')?.length > CONTENT_MAX_LENGTH;
        const substringContent = hasMoreContent
          ? `${highlightedContent?.substring(0, CONTENT_MAX_LENGTH)}`
          : highlightedContent;

        //re-trim if we are in the middle of a word
        const trimWithProperWords = substringContent?.substring(
          0,
          Math.min(substringContent.length, substringContent.lastIndexOf(' ')),
        );

        return {
          filePath,
          title,
          content: hasMoreContent
            ? `${trimWithProperWords}...`
            : substringContent,
          url,
          header,
        };
      });
      return res.status(200).json(mappedData);
    })
    .catch(() => {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong, please try again later',
      });
    });
};

export default semanticSearch;
