import { useWallet } from '@/modules/wallet/wallet.hook';

import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent';
import { useCardLayout } from '@/App/LayoutLandingPage/components/CardLayoutProvider';
import { ProfileListItem } from '@/Components/ProfileListItem/ProfileListItem';
import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons';
import { ChainweaverAlphaLogoKdacolorLight } from '@kadena/kode-icons/product';
import {
  Box,
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
  Link as UiLink,
} from '@kadena/kode-ui';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wrapperClass } from '../errors/styles.css';

export function SelectProfile() {
  const { profileList } = useWallet();
  const { setContent } = useCardLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setContent({
      label: 'Chainweaver v3',
      key: 'chainweaverv3',
      description:
        'Access your profile securely and start managing your assets instantly',
      visual: <ChainweaverAlphaLogoKdacolorLight width={40} height={40} />,
      supportingContent:
        profileList.length > 0 ? (
          <ButtonGroup variant="outlined">
            <UiLink
              href="/create-profile"
              component={Link}
              isCompact
              variant="outlined"
              startVisual={<MonoAdd />}
            >
              New Profile
            </UiLink>
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
        ) : (
          <></>
        ),
    });
  }, [profileList]);

  const handleRecover = () => {
    navigate('/wallet-recovery');
  };

  return (
    <>
      <Box width="100%" className={wrapperClass}>
        {profileList.length ? (
          <Stack flexDirection="column">
            <Heading as="h5">Available Profiles</Heading>
            <Text size="smallest">
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
          </Stack>
        ) : (
          <Stack flexDirection="column" gap="md">
            <Stack flexDirection="column">
              <Heading as="h5">Get Started</Heading>
              <Text size="smallest">
                The user doesn’t have an account yet this copy should give a
                very short intro to the action of creating one
              </Text>
            </Stack>

            <Stack flexDirection="column">
              <Heading as="h6">Recover your wallet</Heading>
              <Text size="smallest">
                Setup a profile by using the wallet recovery feature.
              </Text>
            </Stack>
          </Stack>
        )}
      </Box>

      {profileList.length === 0 && (
        <CardFooterContent>
          <Button variant="outlined" onPress={handleRecover}>
            Recover
          </Button>
          <UiLink
            href="/create-profile"
            component={Link}
            variant="primary"
            endVisual={<MonoAdd />}
          >
            Add new profile
          </UiLink>
        </CardFooterContent>
      )}
    </>
  );
}
