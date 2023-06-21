'use client';

import { IconButton, SystemIcons } from '@kadena/react-components';

import { StyledBody, StyledContainer } from './styles';

import { Exclamation } from '@/resources/svg/generated';
import React, { type FC, useCallback, useState } from 'react';

interface INotificationProps {
  title: string;
  body: string;
}

const Notification: FC<INotificationProps> = ({ title, body }) => {
  const [show, setShow] = useState(true);
  const onCloseClick = useCallback(() => {
    setShow(false);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <StyledContainer>
      <Exclamation />
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
