import { useState } from 'react';
import { useTheme } from 'next-themes'
import { MonoAccountCircle, MonoCheck, MonoClose, MonoContrast, MonoLogout, MonoControlPointDuplicate } from '@kadena/kode-icons';
import SpireKeyKdacolorLogoWhite from '@/components/SpireKeyKdacolorLogoWhite';
import { useAccount } from '@/hooks/account';
import { useTransaction } from '@/hooks/transaction';
import { useRouter } from 'next/navigation';
import { fundAccount } from '@/utils/fund'
import {
  NavHeader,
  NavHeaderLinkList,
  Button,
  NavHeaderButton,
  Notification,
  NotificationFooter,
  NotificationButton,
  NotificationHeading,
  Link,
  Badge
} from '@kadena/kode-ui';
import { MarmaladeMarketplaceLogo } from '@/components/MarmaladeMarketplaceLogo';
import ConnectWallet from '@/components/ConnectWallet';
import * as styles from './style.css';

export const MarketplaceHeader= () => {
  const [showNotification, setShowNotification] = useState(false);
  const { account, login, logout } = useAccount();
  const { setTransaction } = useTransaction();
  const router = useRouter();
  const { theme, setTheme } = useTheme()

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
    <NavHeader logo={
      <a href="/">
        <MarmaladeMarketplaceLogo height={56}/>
      </a>
    }>
      <NavHeaderLinkList>
        <Link
          className={styles.navHeaderLink}
          href="/marketplace"
        >
          Marketplace
        </Link>
        <Link
          href="/tokens"
          endVisual={<Badge size='sm' style={'highContrast'}>beta</Badge>}
        >
          Create
        </Link>
        <Link className={styles.navHeaderLink}
          href="/mint"
          endVisual={<Badge size='sm' style={'highContrast'}>beta</Badge>}
        >
          Mint
        </Link>
        {account ? (<Link className={styles.navHeaderLink}
          href="/mytokens"
        >
          My Tokens
        </Link>) : <></>}
      </NavHeaderLinkList>
      <NavHeaderButton onPress={toggleTheme}  endVisual={<MonoContrast />} />
      {account
        ? (           
            <ConnectWallet 
              showContextMenu={true} 
              account={account.accountName} 
              accountAlias={account.alias} 
              menuItems={[
                {
                  title: 'Fund Account',
                  onClick: () => setShowNotification(true),
                  key: 'fund',
                  startVisual: <MonoControlPointDuplicate />
                },
                {
                  title: 'Profile Settings',
                  onClick: () => router.push('/profile'),
                  key: 'profile',
                  startVisual: <MonoAccountCircle />
                },
                {
                  title: 'Disconnect',
                  onClick: () => logout(),
                  key: 'disconnect',
                  startVisual: <MonoLogout />
                }
              ]}
            />
          )
        : <Button onClick={login} variant="primary" isCompact={false}
        startVisual={<SpireKeyKdacolorLogoWhite style={{color: 'black'}}/>}
        endVisual={<Badge style={'inverse'} size="sm" >Wallet</Badge>}>Connect</Button>
      }
      {showNotification && <div style={{ position: 'absolute', top: '65px', right: "50px" }}>
        <Notification
          intent="info"
          isDismissable={false}
          role="none"
          type="stacked"
        >
          <NotificationHeading>
            Faucet
          </NotificationHeading>
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
      </div>}
    </NavHeader>
  );
};
