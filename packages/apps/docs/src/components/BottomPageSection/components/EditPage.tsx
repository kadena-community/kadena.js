import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import type { PressEvent } from '@kadena/react-ui';
import { Button } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  editLink?: string;
}

export const EditPage: FC<IProps> = ({ editLink }) => {
  if (!editLink) return null;
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onClick = (event: PressEvent) => {
    analyticsEvent(EVENT_NAMES['click:edit_page']);
    window.open(editLink, '_blank');
  };

  return (
    <Button onPress={onClick} title="Edit this page">
      Edit this page
    </Button>
  );
};
