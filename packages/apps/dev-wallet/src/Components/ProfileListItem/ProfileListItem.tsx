import { useWallet } from '@/modules/wallet/wallet.hook';
import { IProfile } from '@/modules/wallet/wallet.repository';
import { getWebAuthnPass } from '@/modules/wallet/wallet.service';
import InitialsAvatar from '@/pages/select-profile/initials';
import { showIcon } from '@/utils/showIcon';
import { Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { iconWrapperClass, profileItemClass } from './styles.css';

interface IProps {
  profile: Pick<IProfile, 'options' | 'name' | 'uuid' | 'accentColor'>;
}

const InnerItem: FC<IProps> = ({ profile }) => {
  return (
    <Stack
      alignItems="center"
      gap="md"
      width="100%"
      className={profileItemClass}
    >
      <Stack className={iconWrapperClass}>
        {showIcon(profile.options.authMode)}
      </Stack>

      <Stack flex={1}>
        <Text>{profile.name}</Text>
      </Stack>
      <InitialsAvatar
        size="small"
        name={profile.name}
        accentColor={profile.accentColor}
      />
    </Stack>
  );
};

export const ProfileListItem: FC<IProps> = ({ profile }) => {
  const { unlockProfile } = useWallet();
  const [params] = useSearchParams();

  const redirect = params.get('redirect');
  const qs = new URLSearchParams();
  if (redirect) {
    qs.set('redirect', redirect);
  }

  const searchParam = qs.toString();

  return profile.options.authMode === 'WEB_AUTHN' ? (
    <button
      key={profile.uuid}
      onClick={async () => {
        const pass = await getWebAuthnPass(profile);
        if (pass) {
          await unlockProfile(profile.uuid, pass);
        }
      }}
      style={{
        width: '100%',
        background: 'transparent',
        border: 0,
        padding: 0,
      }}
    >
      <InnerItem profile={profile} />
    </button>
  ) : (
    <Link
      key={profile.uuid}
      to={`/unlock-profile/${profile.uuid}${searchParam ? `?${searchParam}` : ''}`}
      style={{ textDecoration: 'none', width: '100%' }}
    >
      <InnerItem profile={profile} />
    </Link>
  );
};
