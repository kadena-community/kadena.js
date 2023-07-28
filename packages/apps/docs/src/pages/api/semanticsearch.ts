import { menuData } from '@/data/menu.mjs';
import { IMenuData } from '@/types/Layout';
import { embed } from '@/utils/createEmbedding';
import { PineconeClient } from '@pinecone-database/pinecone';
import { ScoredVector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { NextApiRequest, NextApiResponse } from 'next';

const namespace = 'kda-docs';
const PINECONE_URL = process.env.PINECONE_URL;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;

if (PINECONE_ENVIRONMENT === undefined)
  throw new Error('Env var PINECONE_ENVIRONMENT missing');
if (PINECONE_URL === undefined) throw new Error('Env var PINECONE_URL missing');
if (PINECONE_API_KEY === undefined)
  throw new Error('Env var PINECONE_API_KEY missing');

let pineconeClient: PineconeClient | undefined;

const getPineconeClient = async (): Promise<PineconeClient> => {
  if (pineconeClient) {
    return pineconeClient;
  } else {
    pineconeClient = new PineconeClient();

    await pineconeClient.init({
      apiKey: PINECONE_API_KEY,
      environment: PINECONE_ENVIRONMENT,
    });
  }
  return pineconeClient;
};

const filenameToRoute = (filename: string): string => {
  // Remove "src/pages" from the start of the filename
  let route = filename.replace(/^src\/pages/, '');

  // Remove file extension from the filename
  route = route.replace(/\.(mdx|tsx)$/, '');

  // If the filename ends with "index.*", remove that from the URL
  route = route.replace(/\/index$/, '');

  // Add a leading "/" if it's missing
  if (!route.startsWith('/')) {
    route = `/${route}`;
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

const mapMatches = (match: ScoredVector): ISearchResult => {
  const metadata = (match.metadata as IScoredVectorMetaData) ?? {};
  return {
    id: match.id,
    score: match.score,
    filePath: metadata.filePath,
    content: cleanUpContent(metadata.content),
    ...getData(filenameToRoute(metadata.filePath)),
  } as ISearchResult;
};

const reduceMatches = (
  acc: ScoredVector[],
  val: ScoredVector,
): ScoredVector[] => {
  //taking out double results
  const metadata = (val.metadata as IScoredVectorMetaData) ?? {};
  if (
    acc.find((item: ScoredVector) => {
      const itemMetadata = (item.metadata as IScoredVectorMetaData) ?? {};
      return itemMetadata.filePath === metadata.filePath;
    })
  ) {
    return acc;
  }
  acc.push(val);

  return acc;
};

const search = async (
  req: NextApiRequest,
  res: NextApiResponse<ISearchResult[] | IResponseError>,
): Promise<void> => {
  const client = await getPineconeClient();
  const index = client.Index(namespace);
  const { query, limit = 50 } = req.query;

  if (query === undefined) {
    res.status(405).json({
      status: 400,
      message: 'No query found',
    });
    res.end();
  }

  const queryEmbedding = await embed(query as string);

  const result = await index.query({
    queryRequest: {
      vector: queryEmbedding.values,
      topK: parseInt(limit as string, 10),
      includeMetadata: true,
      includeValues: false,
      namespace,
    },
  });

  const newResults =
    result.matches?.reduce(reduceMatches, []).map(mapMatches) ?? [];

  res.status(200).json(newResults);
  res.end();
};

export default search;
