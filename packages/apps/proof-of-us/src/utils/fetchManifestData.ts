export const fetchManifestData = async (
  token?: IProofOfUsToken,
): Promise<IProofOfUsTokenMeta | undefined> => {
  if (!token || !token.uri) return;
  const result = await fetch(token.uri);
  const data = (await result.json()) as IProofOfUsTokenMeta;

  return data;
};
