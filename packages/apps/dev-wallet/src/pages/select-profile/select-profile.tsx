import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading, Stack, SystemIcon, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';
import InitialsAvatar from './initials';
import { aliasClass, cardClass, imgClass } from './select-profile.css';

export function SelectProfile() {
  const { isUnlocked, profileList, lockProfile } = useWallet();
  if (isUnlocked) {
    lockProfile();
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Select a profile</Heading>
        <Stack
          flexDirection="row"
          alignItems="center"
          padding={'sm'}
          gap={'sm'}
          flexWrap="wrap"
        >
          {profileList.map((profile) => (
            <div key={profile.uuid}>
              <Link
                to={`/unlock-profile/${profile.uuid}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className={cardClass}
                  style={{ backgroundColor: profile.accentColor }}
                >
                  <div className={imgClass}>
                    <InitialsAvatar name={profile.name} />
                  </div>
                  <div className={aliasClass}> {profile.name}</div>
                </div>
              </Link>
            </div>
          ))}
          <Link to="/create-profile" style={{ textDecoration: 'none' }}>
            <div className={cardClass}>
              <div className={imgClass}>
                <MonoAdd />
              </div>

              <div className={aliasClass}>
                <Text bold>Create profile</Text>
              </div>
            </div>
          </Link>
        </Stack>

        <br />
        <Link to="/import-wallet">
          <Text bold>Import/Recover wallet</Text>
        </Link>
      </Box>
    </main>
  );
}
