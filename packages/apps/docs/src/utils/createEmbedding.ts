interface ICreateEmbeddingResponseDataInner {
  index: number;
  object: string;
  embedding: Array<number>;
}

interface IEmbedding {
  values: Array<number>;
}

export const embed = async (text: string): Promise<IEmbedding> => {
  const token = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({ input: text, model: 'text-embedding-ada-002' }),
  });

  const { error, data } = await response.json();

  if (error !== undefined) throw new Error(error.message);

  if (data[0].embedding === undefined)
    throw new Error('No vector returned from the embeddings endpoint');

  return {
    values: data.map((d: ICreateEmbeddingResponseDataInner) => {
      return d.embedding;
    }),
  };
};
