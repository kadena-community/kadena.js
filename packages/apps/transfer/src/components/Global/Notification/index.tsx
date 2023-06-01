'use client';

import { StyledBody, StyledContainer } from './styles';

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
      <div>Icon</div>
      <StyledBody>
        <div>{title}</div>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </StyledBody>
      <button onClick={onCloseClick}>&#10005;</button>
    </StyledContainer>
  );
};

export default Notification;
