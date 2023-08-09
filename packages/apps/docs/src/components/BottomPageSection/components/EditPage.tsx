import { Button } from '@kadena/react-ui';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

interface IProps {
  editLink?: string;
}

export const EditPage: FC<IProps> = ({ editLink }) => {
  const router = useRouter();

  if (!editLink) return null;
  const onClick = async (
    event: React.MouseEvent<HTMLElement>,
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    analyticsEvent(EVENT_NAMES['click:edit_page']);
    await router.push(editLink);
  };
  return (
    <Button
      as="button"
      onClick={onClick}
      rel="noreferrer"
      title="Edit this page"
    >
      Edit this page
    </Button>
  );
};
