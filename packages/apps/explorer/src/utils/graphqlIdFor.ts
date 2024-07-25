export function graphqlIdFor(type: string, hash: string): string {
  return base64Encode(`${type}:${hash}`);
}
export function base64Encode(str: string): string {
  return btoa(str);
}
