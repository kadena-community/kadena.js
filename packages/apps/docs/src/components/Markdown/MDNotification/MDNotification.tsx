import { Notification, NotificationHeading } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { wrapperClass } from '../styles.css';
import { notificationWrapperClass } from './styles.css';
import type { LabelType } from './utils';
import { getColor, getIcon } from './utils';

interface IProps {
  children: ReactNode;
  title?: string;
  label?: LabelType;
}

export const MDNotification: FC<IProps> = ({ children, title = '', label }) => {
  return (
    <div className={classNames(wrapperClass, notificationWrapperClass)}>
      <Notification
        intent={getColor(label)}
        icon={getIcon(label)}
        type="inlineStacked"
        role="none"
      >
        <NotificationHeading>{title}</NotificationHeading>
        {children}
      </Notification>
    </div>
  );
};
