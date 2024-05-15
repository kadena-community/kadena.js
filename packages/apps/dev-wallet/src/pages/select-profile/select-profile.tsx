import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoAdd } from '@kadena/react-icons';
import { Box, Heading, Stack, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';
import InitialsAvatar from './initials';
import {
  aliasClass,
  cardClass,
  imgClass,
  linkClass,
  linkTextClass,
  subtitleClass,
  titleClass,
} from './select-profile.css';

export function SelectProfile() {
  const { isUnlocked, profileList, lockProfile } = useWallet();
  if (isUnlocked) {
    lockProfile();
  }
  return (
    <main>
      <Box>
        <Heading variant="h1" as="h1" className={titleClass}>
          Welcome to <br /> DevWallet v1.0
        </Heading>
        <Heading variant="h5" as="h2" className={subtitleClass}>
          Access your profile securely and start <br />
          managing your assets instantly
        </Heading>
        <Stack
          flexDirection="column"
          alignItems="center"
          gap="sm"
          flexWrap="wrap"
          marginBlock="lg"
        >
          {profileList.map((profile) => (
            <Link
              key={profile.uuid}
              to={`/unlock-profile/${profile.uuid}`}
              style={{ textDecoration: 'none' }}
              className={cardClass}
            >
              <Stack alignItems="center" gap="md">
                <div className={imgClass}>
                  <InitialsAvatar name={profile.name} />
                </div>
                <div className={aliasClass}> {profile.name}</div>
              </Stack>
            </Link>
          ))}
          <Link
            to="/create-profile"
            style={{ textDecoration: 'none' }}
            className={cardClass}
          >
            <Stack alignItems="center" gap="md">
              <div className={imgClass}>
                <MonoAdd color="#ffffff" />
              </div>

              <div className={aliasClass}>
                <Text bold>Add new profile</Text>
              </div>
            </Stack>
          </Link>
        </Stack>
        <Stack flexDirection="column">
          <Text>Own a wallet?</Text>
          <Link to="/import-wallet" className={linkClass}>
            <Text className={linkTextClass}>
              Setup a profile by wallet recovery
            </Text>
          </Link>
        </Stack>
      </Box>
    </main>
  );
}
