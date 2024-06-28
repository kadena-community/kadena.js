import { useState } from 'react';
import { env } from '@/utils/env';
import { MonoAccountCircle, MonoCheck, MonoClose } from '@kadena/react-icons';
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
  NotificationHeading
} from '@kadena/react-ui';

export const MarketplaceHeader= () => {
  const [showNotification, setShowNotification] = useState(false);
  const { account, login, logout } = useAccount();
  const { setTransaction } = useTransaction();
  const router = useRouter();

  const onFundAccount = () => {
    setShowNotification(false);
    const transaction = fundAccount(account?.accountName || '');
    setTransaction(transaction);
    //Redirect to the transaction page
    router.push('/transaction');
  };

  return (
    <NavHeader logo={<a href="/"><KadenaLogo height={40} /></a>}>
      <NavHeaderLinkList>
        <NavHeaderLink
          href="/marketplace"
          onClick={() => {}}
        >
          Marketplace
        </NavHeaderLink>
        <NavHeaderLink
          href="/tokens"
          onClick={() => {}}
        >
          Tokens
        </NavHeaderLink>
        <NavHeaderLink
          href="/transfer"
          onClick={() => {}}
        >
          Transfer
        </NavHeaderLink>
        {account ? (<NavHeaderLink
          href="/mytokens"
          onClick={() => {}}
        >
          My Tokens
        </NavHeaderLink>) : <></>}
      </NavHeaderLinkList>
      {account
        ? (
            <>
              <Tooltip delay={0} content={account.accountName} position="left">
                <a href={env.WALLET_URL} target="_blank"><NavHeaderButton endVisual={<MonoAccountCircle />}/></a>
              </Tooltip>
              <p>{account.alias}</p>
              <Button onClick={() => setShowNotification(true)} variant="primary" isCompact={false}>Fund Account</Button>
              <Button onClick={logout} variant="primary" isCompact={false}>Disconnect</Button>
            </>
          )
        : <Button onClick={login} variant="primary" isCompact={false}>Connect Wallet</Button>
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
