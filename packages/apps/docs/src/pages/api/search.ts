import type { MetaData } from '@7-docs/edge';
import { getCompletionHandler, pinecone } from '@7-docs/edge';

let namespace = 'kda-docs-dev';
if (process.env.NODE_ENV === 'production') {
}
namespace = 'kda-docs';

export const prompt = `Context: {CONTEXT}

Question: {QUERY}

Answer:`;

export const system = `You are an engineering wizard, experienced at solving complex problems across various disciplines. Your knowledge is both wide and deep. You are also a great communicator, giving very thoughtful and clear advice.
Try first to find definitions for key words on the page that is just for definitions. Only then find it on more general pages.
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
    options: {
      topK: 50,
    },
  });

export const config = {
  runtime: 'edge',
};

export default getCompletionHandler({
  OPENAI_API_KEY,
  query,
  system,
  prompt,
  fields: 'title,content,filePath,header,score',
});
