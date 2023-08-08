import { Button } from '@kadena/react-ui';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import React, { FC } from 'react';

interface IProps {
  editLink?: string;
}

export const EditPage: FC<IProps> = ({ editLink }) => {
  if (!editLink) return null;
  const registerClick = (): void => {
    analyticsEvent(EVENT_NAMES['click:edit_page']);
  };
  return (
    <span onClick={registerClick}>
      <Button
        as="a"
        id="bla"
        href={editLink}
        target="_blank"
        rel="noreferrer"
        title="Edit this page"
      >
        Edit this page
      </Button>
    </span>
  );
};
