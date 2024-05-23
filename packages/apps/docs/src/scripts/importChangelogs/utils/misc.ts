export const getPackages = (
  content: IChangelogComplete,
): IChangelogPackage[] => {
  return Object.entries(content).map(([, pkg]) => pkg);
};

export const getVersions = (
  pkg: IChangelogPackage,
): IChangelogPackageVersion[] => {
  if (!pkg.content) return [];
  return Object.entries(pkg.content).map(([, version]) => version);
};
