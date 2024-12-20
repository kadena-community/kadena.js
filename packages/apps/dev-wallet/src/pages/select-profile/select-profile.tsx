import { useWallet } from '@/modules/wallet/wallet.hook';
import { getWebAuthnPass } from '@/modules/wallet/wallet.service';
import { MonoAdd } from '@kadena/kode-icons';
import { Box, Checkbox, Heading, Stack } from '@kadena/kode-ui';
import { tokens } from '@kadena/kode-ui/styles';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [params] = useSearchParams();
  const [openSecModule, setOpenSecModule] = useState(false);

  const redirect = params.get('redirect');
  const qs = new URLSearchParams();
  if (redirect) {
    qs.set('redirect', redirect);
  }
  if (openSecModule) {
    qs.set('openSecModule', 'true');
  }

  const searchParam = qs.toString();

  return (
    <Box width="100%">
      <Heading variant="h1" className={titleClass}>
        Welcome to <br /> Chainweaver v3.0
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
        width="100%"
      >
        {profileList.map((profile) =>
          profile.options.authMode === 'WEB_AUTHN' ? (
            <button
              key={profile.uuid}
              className={cardClass}
              onClick={async () => {
                const pass = await getWebAuthnPass(profile);
                if (pass) {
                  await unlockProfile(profile.uuid, pass, openSecModule);
                }
              }}
            >
              <Stack alignItems="center" gap="md">
                <InitialsAvatar
                  name={profile.name}
                  accentColor={profile.accentColor}
                />

                <div className={aliasClass}> {profile.name}</div>
              </Stack>
            </button>
          ) : (
            <Link
              key={profile.uuid}
              to={`/unlock-profile/${profile.uuid}${searchParam ? `?${searchParam}` : ''}`}
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
        {profileList.length > 0 && (
          <Stack width="100%" marginBlock={'md'}>
            <Checkbox
              isSelected={openSecModule}
              onChange={(isSelected) => setOpenSecModule(isSelected)}
            >
              Open Security module at login
            </Checkbox>
          </Stack>
        )}
      </Stack>
      <Stack flexDirection="column" className={linkBlockClass}>
        <Heading as="h6">Own a wallet?</Heading>
        <Link to="/wallet-recovery" className={linkClass}>
          Recover your wallet
        </Link>
      </Stack>
    </Box>
  );
}
