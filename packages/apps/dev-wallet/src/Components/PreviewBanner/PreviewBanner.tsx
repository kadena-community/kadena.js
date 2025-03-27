import { MonoWallet } from '@kadena/kode-icons/system';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import { useEffect, useState, type FC } from 'react';
import { buttonClass } from './styles.css';

const DISMISSED_PREVIEWBANNERKEY = 'DISMISSED_PREVIEWBANNER';
export const PreviewBanner: FC<{ maxWidth?: number }> = ({ maxWidth }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const { origin } = window.location;
    setShow(false);
    const isDismissed = window.sessionStorage.getItem(
      DISMISSED_PREVIEWBANNERKEY,
    );
    if (!origin.includes('https://wallet.kadena.io') && !isDismissed) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    window.sessionStorage.setItem(DISMISSED_PREVIEWBANNERKEY, 'true');
  };

  if (!show) return null;
  return (
    <Notification
      role="status"
      type="inlineStacked"
      intent="info"
      contentMaxWidth={maxWidth}
      isDismissable
      onDismiss={handleDismiss}
    >
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
