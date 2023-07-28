import type { MetaData } from '@7-docs/edge';
import { getCompletionHandler, pinecone } from '@7-docs/edge';

const namespace = 'kda-docs';

export const prompt = `Context: {CONTEXT}

Question: {QUERY}

Answer:`;

export const system = `You are an enthusiastic expert on the subject of kadena and eager to help out!
Answer the question faithfully using the provided context.
Use Markdown.
Always try to include a code example in language-specific fenced code blocks, preferably typescript or pact, especially if it's provided in the context.
If the answer is not provided in the context, say "Sorry, I don\'t have that information.".`;

type QueryFn = (vector: number[]) => Promise<MetaData[]>;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_URL = process.env.PINECONE_URL;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (OPENAI_API_KEY === undefined)
  throw new Error('Env var OPENAI_API_KEY missing');
if (PINECONE_URL === undefined) throw new Error('Env var PINECONE_URL missing');
if (PINECONE_API_KEY === undefined)
  throw new Error('Env var PINECONE_API_KEY missing');

const query: QueryFn = (vector: number[]) =>
  pinecone.query({
    url: PINECONE_URL,
    token: PINECONE_API_KEY,
    vector,
    namespace,
  });

export const config = {
  runtime: 'edge',
};

export default getCompletionHandler({
  OPENAI_API_KEY,
  query,
  system,
  prompt,
  fields: 'title,content,filePath',
});
