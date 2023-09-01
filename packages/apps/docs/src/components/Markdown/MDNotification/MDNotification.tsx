import { Notification } from '@kadena/react-ui';

import { wrapperClass } from '../styles.css';

import { type LabelType, getColor, getIcon } from './utils';

import React, { type FC, type ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  title?: string;
  label?: LabelType;
}

export const MDNotification: FC<IProps> = ({ children, title = '', label }) => {
  return (
    <div className={wrapperClass}>
      <Notification.Root
        color={getColor(label)}
        title={title}
        expanded
        icon={getIcon(label)}
      >
        {children}
      </Notification.Root>
    </div>
  );
};
