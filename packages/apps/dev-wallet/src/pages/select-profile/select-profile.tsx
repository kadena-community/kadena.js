import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IProfile } from '@/modules/wallet/wallet.repository';
import { recoverPublicKey, retrieveCredential } from '@/utils/webAuthn';
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
  const { profileList, unlockProfile } = useWallet();
  const { unlockHDWallet } = useHDWallet();

  const unlockWithWebAuthn = async (
    profile: Pick<IProfile, 'name' | 'uuid' | 'accentColor' | 'options'>,
  ) => {
    if (profile.options.authMode !== 'WEB_AUTHN') {
      throw new Error('Profile does not support WebAuthn');
    }
    const credentialId = profile.options.webAuthnCredential;
    const credential = await retrieveCredential(credentialId);
    if (!credential) {
      throw new Error('Failed to retrieve credential');
    }
    const keys = await recoverPublicKey(credential);
    for (const key of keys) {
      console.log({ key, type: typeof key[0] });
      const result = await unlockProfile(profile.uuid, key);
      if (result) {
        console.log(`Profile unlocked with: ${key}`);
        // for now we just pick the first key source later we should have a way to select the key source
        const keySource = result.keySources[0];
        if (!keySource) {
          throw new Error('No key source found');
        }
        await unlockHDWallet(keySource.source, key, keySource);
        return;
      }
    }
    console.error('Failed to unlock profile');
  };

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
        {profileList.map((profile) =>
          profile.options.authMode === 'WEB_AUTHN' ? (
            <button
              key={profile.uuid}
              className={cardClass}
              onClick={() => {
                unlockWithWebAuthn(profile);
              }}
            >
              <Stack alignItems="center" gap="md">
                <div
                  className={imgClass}
                  style={{ backgroundColor: profile.accentColor }}
                >
                  <InitialsAvatar
                    name={profile.name}
                    accentColor={profile.accentColor}
                  />
                </div>
                <div className={aliasClass}> {profile.name}</div>
              </Stack>
            </button>
          ) : (
            <Link
              key={profile.uuid}
              to={`/unlock-profile/${profile.uuid}`}
              style={{ textDecoration: 'none' }}
              className={cardClass}
            >
              <Stack alignItems="center" gap="md">
                <div
                  className={imgClass}
                  style={{ backgroundColor: profile.accentColor }}
                >
                  <InitialsAvatar
                    name={profile.name}
                    accentColor={profile.accentColor}
                  />
                </div>
                <div className={aliasClass}> {profile.name}</div>
              </Stack>
            </Link>
          ),
        )}
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
        <Heading as="h6">Own a wallet?</Heading>
        <Link to="/import-wallet" className={linkClass}>
          Setup a profile by wallet recovery
        </Link>
      </Stack>
    </Box>
  );
}
