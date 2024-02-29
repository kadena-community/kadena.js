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
  if (!uri) return;
  const result = await fetch('/api/manifest', {
    method: 'POST',
    body: JSON.stringify({
      uri,
    }),
  });
  const data = (await result.json()) as IProofOfUsTokenMeta;

  return data;
};
