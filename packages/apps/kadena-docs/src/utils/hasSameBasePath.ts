export const hasSameBasePath = (
  pathname1?: string,
  pathname2?: string,
): boolean => {
  return (
    pathname1?.split('/').slice(0, 3).join('/') ===
    pathname2?.split('/').slice(0, 3).join('/')
  );
};
