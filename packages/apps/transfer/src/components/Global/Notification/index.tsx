'use client';

import { IconButton, SystemIcons } from '@kadena/react-components';

import { StyledBody, StyledContainer } from './styles';

import React, { type FC, useCallback, useState } from 'react';

interface INotificationProps {
  title: string;
  body: string;
  onClose?: () => void;
}

const Notification: FC<INotificationProps> = ({ title, body, onClose }) => {
  const [show, setShow] = useState(true);
  const onCloseClick = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
    setShow(false);
  }, [onClose]);

  if (!show) {
    return null;
  }

  return (
    <StyledContainer>
      <SystemIcons.AlertCircleOutline />
      <StyledBody>
        <div>
          <strong>{title}</strong>
        </div>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </StyledBody>
      <IconButton
        as="button"
        title="Close notification"
        icon={SystemIcons.Close}
        onClick={onCloseClick}
      />
    </StyledContainer>
  );
};

export default Notification;
