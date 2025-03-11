import { useWallet } from '@/modules/wallet/wallet.hook';

import { MonoAdd } from '@kadena/kode-icons';
import { ChainweaverAlphaLogoKdacolorLight } from '@kadena/kode-icons/product';
import { Box, Button, Card, Heading, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { Link } from 'react-router-dom';
import { wrapperClass } from '../errors/styles.css';

import { ProfileListItem } from '@/Components/ProfileListItem/ProfileListItem';

export function SelectProfile() {
  const { profileList } = useWallet();

  return (
    <Card>
      <CardContentBlock
        title="Chainweaver v3.0"
        description="Access your profile securely and start
            managing your assets instantly"
        visual={<ChainweaverAlphaLogoKdacolorLight width={64} height={64} />}
        supportingContent={
          <Link to="/create-profile">
            <Button isCompact variant="outlined" startVisual={<MonoAdd />}>
              New Profile
            </Button>
          </Link>
        }
      >
        <Box width="100%" className={wrapperClass}>
          <Heading as="h5">Available Profiles</Heading>
          <Text>
            The user has already created some profiles and can access those with
            the leading icon as authentication method.
          </Text>
          <Stack
            flexDirection="column"
            alignItems="center"
            gap="sm"
            flexWrap="wrap"
            marginBlock="lg"
            width="100%"
          >
            {profileList.map((profile) => (
              <ProfileListItem key={profile.uuid} profile={profile} />
            ))}
          </Stack>
          <Stack width="100%" justifyContent="flex-end">
            <Link to="/wallet-recovery">
              <Button isCompact variant="outlined">
                Recover your wallet
              </Button>
            </Link>
          </Stack>
        </Box>
      </CardContentBlock>
    </Card>
  );
}
