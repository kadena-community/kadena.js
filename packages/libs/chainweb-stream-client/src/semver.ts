export interface IVersion {
  major: number;
  minor: number;
  patch: number | string;
}

export function parse(versionStr: IVersion | string): IVersion {
  if (typeof versionStr !== 'string') {
    return versionStr;
  }
  const versionStrParts = versionStr.split('.');
  const [major, minor, patchNum] = versionStrParts.map((n) => Number(n));
  const patch = isNaN(patchNum) ? versionStrParts[2] : patchNum;
  return { major, minor, patch };
}

export function isMajorCompatible(
  clientMixed: string | IVersion,
  serverMixed: string | IVersion,
): boolean {
  const [client, server] = [clientMixed, serverMixed].map((version) =>
    parse(version),
  );
  return client.major === server.major;
}

export function isMinorCompatible(
  clientMixed: string | IVersion,
  serverMixed: string | IVersion,
): boolean {
  const [client, server] = [clientMixed, serverMixed].map((version) =>
    parse(version),
  );
  return client.minor === server.minor;
}

export function isClientAhead(
  clientMixed: string | IVersion,
  serverMixed: string | IVersion,
): boolean {
  const [client, server] = [clientMixed, serverMixed].map((version) =>
    parse(version),
  );
  return client.minor > server.minor;
}
