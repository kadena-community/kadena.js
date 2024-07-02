import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import type { IButtonProps } from '@kadena/kode-ui';
import { Button } from '@kadena/kode-ui';
import { MonoCreate } from '@kadena/react-icons/system';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  editLink?: string;
  variant?: IButtonProps['variant'];
  isCompact?: IButtonProps['isCompact'];
}

export const EditPage: FC<IProps> = ({ editLink, variant, isCompact }) => {
  if (!editLink) return null;

  const onClick = (): void => {
    analyticsEvent(EVENT_NAMES['click:edit_page']);
    window.open(editLink, '_blank');
  };

  return (
    <Button
      startVisual={<MonoCreate />}
      variant={variant}
      isCompact={isCompact}
      onPress={onClick}
      title="Edit this page"
    >
      Edit this page
    </Button>
  );
};
