import { useState } from 'react';
import { useTheme } from 'next-themes'
import { env } from '@/utils/env';
import { MonoAccountCircle, MonoCheck, MonoClose, MonoContrast} from '@kadena/kode-icons';
import SpireKeyKdacolorLogoWhite from '@/components/SpireKeyKdacolorLogoWhite';
import { useAccount } from '@/hooks/account';
import { useTransaction } from '@/hooks/transaction';
import { useRouter } from 'next/navigation';
import { fundAccount } from '@/utils/fund'
import {
  NavHeader,
  KadenaLogo,
  NavHeaderLinkList,
  NavHeaderLink,
  Button,
  NavHeaderButton,
  Tooltip,
  Notification,
  NotificationFooter,
  NotificationButton,
  NotificationHeading,
  Link,
  Badge,
  Select,
  SelectItem
} from '@kadena/kode-ui';
import { MarmaladeMarketplaceLogo } from '@/components/MarmaladeMarketplaceLogo';
import * as styles from './style.css';

export const MarketplaceHeader= () => {
  const [showNotification, setShowNotification] = useState(false);
  const { account, webauthnAccount, login, logout } = useAccount();
  const { setTransaction } = useTransaction();
  const router = useRouter();
  const { theme, setTheme } = useTheme()

  const handleSelectionChange = (key: string) => {
    if (key === 'fund') {
      setShowNotification(true)
    } else if (key === 'disconnect') {
      logout();
    }
  };

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
          // onClick={() => {}}
        >
          Marketplace
        </Link>
        <Link
          href="/tokens"
          // onClick={() => {}}
          endVisual={<Badge size='sm' style={'highContrast'}>beta</Badge>}
        >
          Create
        </Link>
        <Link className={styles.navHeaderLink}
          href="/mint"
          // onClick={() => {}}
          endVisual={<Badge size='sm' style={'highContrast'}>beta</Badge>}
        >
          Mint
        </Link>
        {account ? (<Link className={styles.navHeaderLink}
          href="/mytokens"
          // onClick={() => {}}
        >
          My Tokens
        </Link>) : <></>}
      </NavHeaderLinkList>
      <NavHeaderButton onPress={toggleTheme}  endVisual={<MonoContrast />} />
      {account
        ? (
            <>
              {/* <Button onClick={() => setShowNotification(true)} variant="primary" isCompact={false}>Fund Account</Button> */}
              <div className={styles.walletContainer}>
                <Button
                  className={styles.walletButton}
                  variant="primary"
                  isCompact={false}
                  startVisual={<SpireKeyKdacolorLogoWhite style={{color: 'black'}}/>}
                  endVisual={<Badge style="inverse" size="sm">{webauthnAccount?.account.slice(0,5) + "..." + webauthnAccount?.account.slice(-3)}</Badge>}
                >
                  {account.alias}
                </Button>
                <div className={styles.selectContainer}>
                  <Select className={styles.walletOption} placeholder="..." onSelectionChange={(key) => handleSelectionChange(key as string)}>
                    <SelectItem  key={'fund'} >Fund Account</SelectItem>
                    <SelectItem key={'profile'}>Profile Settings</SelectItem>
                    <SelectItem key={'disconnect'}>Disconnect</SelectItem>
                  </Select>
                </div>
              </div>
            </>

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
