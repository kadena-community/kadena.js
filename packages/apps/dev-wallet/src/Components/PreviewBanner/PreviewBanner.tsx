import { Notification, NotificationHeading } from '@kadena/kode-ui';
import { useEffect, useState, type FC } from 'react';

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
      type="inline"
      intent="warning"
      contentMaxWidth={maxWidth}
      isDismissable
      onDismiss={handleDismiss}
    >
      <NotificationHeading>Caution</NotificationHeading>
      This is an unreleased version of the Kadena Wallet. Use with caution!
    </Notification>
  );
};
