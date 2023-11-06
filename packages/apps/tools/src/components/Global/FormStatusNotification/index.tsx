import type { INotificationProps } from '@kadena/react-ui';
import { Notification } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { containerStyle } from './styles.css';

export type FormStatus = 'idle' | 'successful' | 'erroneous' | 'processing';

export type Titles = Record<FormStatus, string>;
export type Bodies = Record<FormStatus, React.ReactNode>;

const statusToColorMap: Record<FormStatus, INotificationProps['color']> = {
  erroneous: 'negative',
  idle: 'warning',
  processing: 'info',
  successful: 'positive',
};

const statusToIconMap: Record<FormStatus, INotificationProps['icon']> = {
  erroneous: 'AlertBox',
  idle: 'AlertCircleOutline',
  processing: 'Information',
  successful: 'Check',
};

export interface IFormStatusNotificationProps {
  status?: FormStatus;
  title?: string;
  body?: React.ReactNode;
  statusTitles?: Partial<Titles>;
  statusBodies?: Partial<Bodies>;
  children?: INotificationProps['children'];
}

export const FormStatusNotification: FC<IFormStatusNotificationProps> = (
  { status, body, title, statusTitles, statusBodies, children } = {
    status: 'idle',
  },
) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(status !== 'idle');

  useEffect(() => {
    setShow(status !== 'idle');
  }, [status]);

  const titles: Titles = {
    ...{
      idle: t('form-status-title-idle'),
      erroneous: t('form-status-title-erroneous'),
      processing: t('form-status-title-processing'),
      successful: t('form-status-title-successful'),
    },
    ...statusTitles,
  };

  const bodies: Bodies = {
    ...{
      idle: t('form-status-body-idle'),
      erroneous: t('form-status-body-erroneous'),
      processing: t('form-status-body-processing'),
      successful: t('form-status-body-successful'),
    },
    ...statusBodies,
  };

  const onNotificationCloseClick = useCallback(() => {
    setShow(false);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className={containerStyle}>
      <Notification.Root
        color={statusToColorMap[status!]}
        hasCloseButton
        icon={statusToIconMap[status!]}
        expanded
        title={title ?? titles[status!]}
        onClose={onNotificationCloseClick}
        variant="outlined"
      >
        {body ?? bodies[status!]}
        {children}
      </Notification.Root>
    </div>
  );
};
