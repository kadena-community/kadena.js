/**
 * The maximum number of input tokens for the embedding model v2 is 8191. There seems to be no tokenizer for JS
 * available. Some use "4 characters per token", others "4/3 tokens per word". This can vary per language. And there
 * needs to be some kind of safety margin to stay within the boundaries and prevent erors.
 */
export const OPENAI_EMBEDDING_MODEL = 'text-embedding-ada-002';
export const OPENAI_MAX_INPUT_TOKENS = 8191;
export const OPENAI_OUTPUT_DIMENSIONS = 1536;

export const OPENAI_TOKENS_PER_WORD = 4 / 3;

const GRANULARITY = 0.5; // Higher means smaller and more embeddings, and more fine-grained results. Capped at TOKEN_MARGIN.
const TOKEN_MARGIN = 0.05; // Safety margin as token calculation is only an estimate
export const CHUNK_SIZE =
  (OPENAI_MAX_INPUT_TOKENS / OPENAI_TOKENS_PER_WORD) *
  (1 - Math.max(TOKEN_MARGIN, GRANULARITY));
