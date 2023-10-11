export const hasSameBasePath = (
  pathname1?: string,
  pathname2?: string,
): boolean => {
  const basePathLength = 2;
  return (
    pathname1?.split('/').slice(0, basePathLength).join('/').toLowerCase() ===
    pathname2?.split('/').slice(0, basePathLength).join('/').toLowerCase()
  );
};
