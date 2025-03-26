import { MonoWallet } from '@kadena/kode-icons/system';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import { useEffect, useState, type FC } from 'react';
import { buttonClass } from './styles.css';

export const PreviewBanner: FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const { origin } = window.location;
    setShow(false);
    if (!origin.includes('https://wallet.kadena.io')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;
  return (
    <Notification role="status" type="stacked" intent="info">
      <NotificationHeading>Preview</NotificationHeading>
      This a preview / canary release of the app.
      <br />
      This app is under constant development
      <br />
      and therefor could be less stable than the production app and is for
      testing only.
      <NotificationFooter>
        <a className={buttonClass} href="https://wallet.kadena.io">
          <NotificationButton icon={<MonoWallet />} intent="info">
            Go to live wallet
          </NotificationButton>
        </a>
      </NotificationFooter>
    </Notification>
  );
};
