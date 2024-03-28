import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { Button } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  editLink?: string;
}

export const EditPage: FC<IProps> = ({ editLink }) => {
  if (!editLink) return null;
  const onClick = async (
    event: React.MouseEvent<HTMLElement>,
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    analyticsEvent(EVENT_NAMES['click:edit_page']);
    window.open(editLink, '_blank');
  };
  return (
    <Button onPress={onClick} title="Edit this page">
      Edit this page
    </Button>
  );
};
