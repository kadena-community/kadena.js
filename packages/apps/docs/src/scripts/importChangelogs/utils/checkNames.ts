import { VersionPosition } from '../constants';

/**
 * in the changelog MD files there are headers and depending on the header
 * all the content in that section is a patch, minor or misc content
 * atm there is no other way then to check the names of those headers to see where the content should live in the changelogs.json
 */
export const checkPatchNames = (value: string): boolean => {
  const names = ['patch changes', 'bugfixes', 'tests'];

  return names.includes(value.toLowerCase());
};

export const checkMinorNames = (value: string): boolean => {
  const names = ['minor changes', 'features'];

  return names.includes(value.toLowerCase());
};

export const checkVersionPosition = (value: string): VersionPosition => {
  switch (true) {
    case checkPatchNames(value):
      return VersionPosition.PATCH;

    case checkMinorNames(value):
      return VersionPosition.MINOR;

    default:
      return VersionPosition.MISC;
  }
};
