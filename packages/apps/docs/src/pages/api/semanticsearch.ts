import { embed } from '@/utils/embedder';
import { PineconeClient } from '@pinecone-database/pinecone';
import { ScoredVector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import fs from 'fs';
import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';
import { NextApiRequest, NextApiResponse } from 'next';

interface IFrontmatterData {
  title?: string;
  description?: string;
}

interface IBranch {
  value: string;
}

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

const getFrontMatter = (doc: string): IFrontmatterData => {
  const tree = fromMarkdown(doc.toString(), {
    extensions: [frontmatter()],
    mdastExtensions: [frontmatterFromMarkdown()],
  });
  const value = tree.children[0] as IBranch;

  return yaml.load(value.value);
};

const getData = (file: string): IFrontmatterData => {
  if (fs.existsSync(file)) {
    const doc = fs.readFileSync(file, 'utf-8');
    const data = getFrontMatter(doc);

    return {
      title: data.title,
      description: data.description,
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
    ...getData(metadata.filePath),
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
  const { query } = req.query;

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
      topK: 50,
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
