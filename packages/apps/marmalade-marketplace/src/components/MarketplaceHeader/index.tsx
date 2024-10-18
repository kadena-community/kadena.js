import ConnectWallet from '@/components/ConnectWallet';
import { MarmaladeMarketplaceLogo } from '@/components/MarmaladeMarketplaceLogo';
import SpireKeyKdacolorLogoWhite from '@/components/SpireKeyKdacolorLogoWhite';
import { useAccount } from '@/hooks/account';
import { useTransaction } from '@/hooks/transaction';
import { fundAccount } from '@/utils/fund';
import {
  MonoAccountCircle,
  MonoCheck,
  MonoClose,
  MonoContrast,
  MonoControlPointDuplicate,
  MonoLogout,
  MonoMenuOpen,
} from '@kadena/kode-icons';
import {
  Badge,
  Button,
  ContextMenu,
  ContextMenuItem,
  Media,
  NavHeader,
  NavHeaderButton,
  NavHeaderLinkList,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Stack,
  Link as UILink,
} from '@kadena/kode-ui';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as styles from './style.css';

export const MarketplaceHeader = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { account, login, logout } = useAccount();
  const { setTransaction } = useTransaction();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const onFundAccount = () => {
    setShowNotification(false);
    const transaction = fundAccount(account?.accountName || '');
    setTransaction(transaction);
    // Redirect to the transaction page
    router.push('/transaction');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <NavHeader
      logo={
        <Link href="/">
          <MarmaladeMarketplaceLogo height={56} />
        </Link>
      }
    >
      <NavHeaderLinkList>
        <Media lessThan="md">
          <Stack flex={1}></Stack>
        </Media>
        <Media greaterThanOrEqual="md">
          <Link href="/" passHref legacyBehavior>
            <UILink className={styles.navHeaderLink}>Marketplace</UILink>
          </Link>
          <Link href="/tokens" passHref legacyBehavior>
            <UILink
              className={styles.navHeaderLink}
              endVisual={
                <Badge size="sm" style={'highContrast'}>
                  beta
                </Badge>
              }
            >
              Create
            </UILink>
          </Link>
          {account ? (
            <Link href="/mytokens" passHref legacyBehavior>
              <UILink className={styles.navHeaderLink}>My Tokens</UILink>
            </Link>
          ) : (
            <></>
          )}
        </Media>
      </NavHeaderLinkList>

      <NavHeaderButton onPress={toggleTheme} endVisual={<MonoContrast />} />

      <Stack className={styles.accountButtonWrapperClass} gap="md">
        {account ? (
          <ConnectWallet
            showContextMenu={true}
            account={account.accountName}
            accountAlias={account.alias}
            menuItems={[
              {
                title: 'Fund Account',
                onClick: () => setShowNotification(true),
                key: 'fund',
                startVisual: <MonoControlPointDuplicate />,
              },
              {
                title: 'Profile Settings',
                onClick: () => router.push('/profile'),
                key: 'profile',
                startVisual: <MonoAccountCircle />,
              },
              {
                title: 'Disconnect',
                onClick: () => logout(),
                key: 'disconnect',
                startVisual: <MonoLogout />,
              },
            ]}
          />
        ) : (
          <Button
            onClick={login}
            variant="primary"
            isCompact={false}
            startVisual={
              <SpireKeyKdacolorLogoWhite style={{ color: 'black' }} />
            }
            endVisual={
              <Badge style={'inverse'} size="sm">
                Wallet
              </Badge>
            }
          >
            Connect
          </Button>
        )}
        <Media lessThan="md">
          <ContextMenu trigger={<Button endVisual={<MonoMenuOpen />} />}>
            <ContextMenuItem
              label="Marketplace"
              onClick={() => router.push('/')}
            />
            <ContextMenuItem
              label="Create"
              onClick={() => router.push('/tokens')}
              endVisual={
                <Badge size="sm" style={'highContrast'}>
                  beta
                </Badge>
              }
            />
            <ContextMenuItem
              label="Mint"
              onClick={() => router.push('/mint')}
              endVisual={
                <Badge size="sm" style={'highContrast'}>
                  beta
                </Badge>
              }
            />
            <ContextMenuItem
              label="My Tokens"
              onClick={() => router.push('/mytokens')}
            />
          </ContextMenu>
        </Media>
      </Stack>
      {showNotification && (
        <Notification
          intent="info"
          isDismissable={false}
          role="none"
          type="stacked"
        >
          <NotificationHeading>Faucet</NotificationHeading>
          Are you sure you want to fund your account with 20 KDA?
          <NotificationFooter>
            <NotificationButton
              icon={<MonoCheck />}
              intent="positive"
              onClick={onFundAccount}
            >
              Confirm
            </NotificationButton>
            <NotificationButton
              icon={<MonoClose />}
              intent="negative"
              onClick={() => setShowNotification(false)}
            >
              Cancel
            </NotificationButton>
          </NotificationFooter>
        </Notification>
      )}
    </NavHeader>
  );
};
