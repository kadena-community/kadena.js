export const fetchManifestData = async (
  uri?: string,
): Promise<IProofOfUsTokenMeta | undefined> => {
  if (!uri) return;
  const result = await fetch(uri);
  const data = (await result.json()) as IProofOfUsTokenMeta;

  return data;
};
