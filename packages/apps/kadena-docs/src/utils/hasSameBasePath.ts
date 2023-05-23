export const hasSameBasePath = (
  pathname1?: string,
  pathname2?: string,
): boolean => {
  let basePathLength = 3;
  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    basePathLength = 4;
  }

  return (
    pathname1?.split('/').slice(0, basePathLength).join('/').toLowerCase() ===
    pathname2?.split('/').slice(0, basePathLength).join('/').toLowerCase()
  );
};
