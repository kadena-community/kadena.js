import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoAdd } from '@kadena/react-icons';
import { Box, Heading, Stack } from '@kadena/react-ui';
import { tokens } from '@kadena/react-ui/styles';
import { Link } from 'react-router-dom';
import InitialsAvatar from './initials';
import {
  aliasClass,
  cardClass,
  imgClass,
  linkBlockClass,
  linkClass,
  subtitleClass,
  titleClass,
} from './select-profile.css';

export function SelectProfile() {
  const { isUnlocked, profileList, lockProfile } = useWallet();
  if (isUnlocked) {
    lockProfile();
  }
  return (
    <Box>
      <Heading variant="h1" className={titleClass}>
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
              <MonoAdd color={tokens.kda.foundation.color.neutral.n100} />
            </div>

            <div className={aliasClass}>Add new profile</div>
          </Stack>
        </Link>
      </Stack>
      <Stack flexDirection="column" className={linkBlockClass}>
        <span>Own a wallet?</span>
        <Link to="/import-wallet" className={linkClass}>
          Setup a profile by wallet recovery
        </Link>
      </Stack>
    </Box>
  );
}
