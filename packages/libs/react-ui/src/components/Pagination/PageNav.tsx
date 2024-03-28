import type { FC } from 'react';
import React from 'react';
import { Button } from '../Button';
import { SystemIcon } from '../Icon';

interface IPageNavProps {
  label: string;
  direction?: 'prev' | 'next';
  isDisabled?: boolean;
  onClick: () => void;
}

export const PageNav: FC<IPageNavProps> = ({
  label,
  direction,
  isDisabled = false,
  onClick,
}) => {
  const isPrevious = direction === 'prev';
  const isNext = direction === 'next';

  return (
    <Button
      variant="transparent"
      isDisabled={isDisabled}
      onPress={onClick}
      startIcon={isPrevious ? <SystemIcon.LeadingIcon /> : undefined}
      endIcon={isNext ? <SystemIcon.TrailingIcon /> : undefined}
    >
      {label}
    </Button>
  );
};
