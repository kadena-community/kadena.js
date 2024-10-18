import { MonoCheck, MonoClose } from '@kadena/kode-icons';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import React, { FC } from 'react';

interface TransactionPreviewProps {
  preview: boolean;
  error: boolean;
  txResponse: string;
  sendTransaction: () => void;
  setShowNotification: (showNotification: boolean) => void;
  showNotification: boolean;
}

const TransactionPreview: FC<TransactionPreviewProps> = ({
  sendTransaction,
  preview,
  setShowNotification,
  error,
  txResponse,
}) => {
  return (
    <div style={{ position: 'absolute', top: '65px', right: '50px' }}>
      <Notification
        intent={error ? 'negative' : 'positive'}
        isDismissable={false}
        role="none"
        type="stacked"
      >
        <NotificationHeading>
          {preview ? 'Transaction Preview' : 'Transaction Sent'}
        </NotificationHeading>
        {error
          ? txResponse
          : preview
            ? 'Preview Successful'
            : 'Transaction Sent Successfully'}
        <NotificationFooter>
          {preview && !error && (
            <NotificationButton
              icon={<MonoCheck />}
              intent="positive"
              onClick={() => {
                sendTransaction();
                setShowNotification(false);
              }}
            >
              Send Transaction
            </NotificationButton>
          )}

          <NotificationButton
            icon={<MonoClose />}
            intent="negative"
            onClick={() => setShowNotification(false)}
          >
            Cancel
          </NotificationButton>
        </NotificationFooter>
      </Notification>
    </div>
  );
};
export default TransactionPreview;
