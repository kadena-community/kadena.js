import { useWallet } from '@/modules/wallet/wallet.hook';
import { IProfilePicked, unlockWithWebAuthn } from '@/utils/unlockWithWebAuthn';
import { MonoMoreHoriz } from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Stack,
} from '@kadena/kode-ui';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from './components/Profile';
import { profileClass, profileListClass } from './components/style.css';

const getInitial = (name: string): string => {
  return name.at(0)?.toUpperCase() ?? '-';
};

export const ProfileChanger: FC = () => {
  const {
    profileList,
    profile: currentProfile,
    unlockProfile,
    lockProfile,
  } = useWallet();
  const navigate = useNavigate();

  const handleSelect = async (profile: IProfilePicked) => {
    if (profile.options.authMode === 'WEB_AUTHN') {
      await unlockWithWebAuthn(profile, unlockProfile);
    } else {
      navigate(`/unlock-profile/${profile.uuid}`);
    }
  };

  const filteredProfile = profileList.filter(
    (p) => p.uuid !== currentProfile?.uuid,
  )[0];

  const hasMoreOptions = profileList.length > 2;

  return (
    <Stack as="section" className={profileListClass}>
      {hasMoreOptions && (
        <ContextMenu
          placement="bottom start"
          trigger={
            <Button className={profileClass()}>
              <MonoMoreHoriz />
            </Button>
          }
        >
          {profileList.map((profile) => {
            return (
              <ContextMenuItem
                key={profile.uuid}
                label={profile.name}
                onClick={() => {
                  handleSelect(profile);
                }}
              />
            );
          })}
          <ContextMenuDivider />
          <ContextMenuItem label="logout" onClick={lockProfile} />
        </ContextMenu>
      )}

      {filteredProfile && (
        <Profile
          key={filteredProfile.uuid}
          color={filteredProfile.accentColor}
          idx={hasMoreOptions ? 1 : 0}
          hasMoreOptions={hasMoreOptions}
          isActive={currentProfile?.uuid === filteredProfile.uuid}
          onClick={() => handleSelect(filteredProfile)}
        >
          {getInitial(filteredProfile.name)}
        </Profile>
      )}

      {currentProfile && (
        <Profile
          key={currentProfile.uuid}
          color={currentProfile.accentColor}
          idx={hasMoreOptions ? 2 : 0}
          hasMoreOptions={hasMoreOptions}
          isActive={currentProfile?.uuid === currentProfile.uuid}
          onClick={() => handleSelect(currentProfile)}
        >
          {getInitial(currentProfile.name)}
        </Profile>
      )}
    </Stack>
  );
};
