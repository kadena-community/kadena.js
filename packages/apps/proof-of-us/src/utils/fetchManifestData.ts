export const fetchManifestData = async (
  uri?: string,
): Promise<IProofOfUsTokenMeta | undefined> => {
  if (!uri) return;
  const result = await fetch(uri);
  const data = (await result.json()) as IProofOfUsTokenMeta;

  return data;
};

export const fetchManifestDataApi = async (
  uri?: string,
): Promise<IProofOfUsTokenMeta | undefined> => {
  console.log(uri, 'fetchManifestDataApi');
  if (!uri) return;

  console.log('start fetch');
  const result = await fetch('/api/manifest', {
    method: 'POST',
    body: JSON.stringify({
      uri,
    }),
  });
  const text = await result.text();
  console.log('end fetch');
  console.log('result', text);
  const data = JSON.parse(text) as IProofOfUsTokenMeta;

  return data;
};
