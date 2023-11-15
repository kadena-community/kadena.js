import { Notification, SystemIcon } from '@kadena/react-ui';
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
      <Notification.Root
        color={getColor(label)}
        icon={getIcon(label)}
        styleVariant="borderless"
        role="none"
      >
        <Notification.Heading>{title}</Notification.Heading>
        {children}
      </Notification.Root>
    </div>
  );
};
