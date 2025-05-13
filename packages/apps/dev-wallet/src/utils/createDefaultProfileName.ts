import { IProfile } from '@/modules/wallet/wallet.repository';

export const createDefaultProfileName = (
  profileList: Pick<IProfile, 'accentColor' | 'options' | 'name' | 'uuid'>[],
): string => {
  const newName =
    profileList.length === 0 ? 'default' : `profile-${profileList.length + 1}`;

  if (profileList.find((v) => v.name === newName)) {
    return createDefaultProfileName([...profileList, {} as any]);
  }

  return newName;
};
