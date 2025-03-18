import { useWallet } from '@/modules/wallet/wallet.hook';

import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons';
import { ChainweaverAlphaLogoKdacolorLight } from '@kadena/kode-icons/product';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  ContextMenu,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { CardContentBlock, CardFooterGroup } from '@kadena/kode-ui/patterns';
import { Link, useNavigate } from 'react-router-dom';
import { wrapperClass } from '../errors/styles.css';

import { ProfileListItem } from '@/Components/ProfileListItem/ProfileListItem';

export function SelectProfile() {
  const { profileList } = useWallet();
  const navigate = useNavigate();

  const handleRecover = () => {
    navigate('/wallet-recovery');
  };

  return (
    <Card>
      <CardContentBlock
        title="Chainweaver v3"
        description="Access your profile securely and start
            managing your assets instantly"
        visual={<ChainweaverAlphaLogoKdacolorLight width={64} height={64} />}
        supportingContent={
          profileList.length > 0 && (
            <ButtonGroup variant="outlined">
              <Link to="/create-profile">
                <Button isCompact variant="outlined" startVisual={<MonoAdd />}>
                  New Profile
                </Button>
              </Link>
              <ContextMenu
                trigger={
                  <Button
                    variant="outlined"
                    isCompact
                    endVisual={<MonoMoreVert />}
                  />
                }
              >
                <ContextMenuItem
                  onClick={handleRecover}
                  label="Recover your wallet"
                />
              </ContextMenu>
            </ButtonGroup>
          )
        }
      >
        <Box width="100%" className={wrapperClass}>
          {profileList.length ? (
            <>
              <Heading as="h5">Available Profiles</Heading>
              <Text>
                The user has already created some profiles and can access those
                with the leading icon as authentication method.
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
            </>
          ) : (
            <Stack flexDirection="column" gap="md">
              <Stack flexDirection="column">
                <Heading as="h5">Get Started</Heading>
                <Text>
                  The user doesn’t have an account yet this copy should give a
                  very short intro to the action of creating one
                </Text>
              </Stack>

              <Stack flexDirection="column">
                <Heading as="h5">Recover your wallet</Heading>
                <Text>
                  Setup a profile by using the wallet recovery feature.
                </Text>
              </Stack>
            </Stack>
          )}
        </Box>
      </CardContentBlock>
      {profileList.length === 0 && (
        <CardFooterGroup>
          <Button variant="outlined" onPress={handleRecover}>
            Recover
          </Button>
          <Link to="/create-profile">
            <Button endVisual={<MonoAdd />}>Add new profile</Button>
          </Link>
        </CardFooterGroup>
      )}
    </Card>
  );
}
