import { Notification } from '@kadena/react-ui';

import { wrapperClass } from '../styles.css';

import { getColor, getIcon, LabelType } from './utils';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  title?: string;
  label?: LabelType;
}

function getNoficationColor(label?: LabelType) {
  const color = getColor(label);

  if (color === 'primary') {
    return 'positive'
  }

  if (color === 'secondary') {
    return 'warning'
  }

  if (color === 'tertiary') {
    return 'negative'
  }

  return color;
}

export const MDNotification: FC<IProps> = ({ children, title = '', label }) => {
  return (
    <div className={wrapperClass}>
      <Notification.Root
        color={getNoficationColor(label)}
        title={title}
        expanded
        icon={getIcon(label)}
      >
        {children}
      </Notification.Root>
    </div>
  );
};
